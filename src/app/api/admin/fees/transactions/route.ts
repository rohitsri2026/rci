import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/auth";
import { NotificationService } from "@/lib/notifications/service";

export async function POST(request: Request) {
  const supabase = await createClient();
  
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { ledger_id, amount_paid, payment_mode } = await request.json();
    if (!ledger_id || !amount_paid || !payment_mode) {
      return NextResponse.json({ error: "Missing required fields: ledger_id, amount_paid, payment_mode" }, { status: 400 });
    }

    // 1. Fetch Ledger details to get total amount & student details
    const { data: ledger, error: ledgerError } = await supabase
      .from("student_fees_ledger")
      .select(`
        *,
        students:student_id (
          id,
          full_name,
          email,
          phone,
          courses:course_id (
            course_name
          )
        ),
        fee_plans:fee_plan_id (
          total_amount
        )
      `)
      .eq("id", ledger_id)
      .single();

    if (ledgerError || !ledger) {
      return NextResponse.json({ error: "Ledger not found" }, { status: 404 });
    }

    const receipt_number = `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Insert Fee Transaction
    const { data: transaction, error: transError } = await supabase
      .from("fee_transactions")
      .insert([
        {
          ledger_id,
          amount_paid: Number(amount_paid),
          payment_mode,
          receipt_number,
        }
      ])
      .select()
      .single();

    if (transError) throw transError;

    // 3. Fetch all transactions to update ledger totals
    const { data: transactions } = await supabase
      .from("fee_transactions")
      .select("amount_paid")
      .eq("ledger_id", ledger_id);

    const total_paid = (transactions || []).reduce((sum, t) => sum + Number(t.amount_paid), 0);
    const plan_total = Number((ledger.fee_plans as any)?.total_amount) || 0;
    const discount = Number(ledger.discount_amount) || 0;
    const due_amount = plan_total - discount;

    let status = "Unpaid";
    if (total_paid >= due_amount) {
      status = "Paid";
    } else if (total_paid > 0) {
      status = "Partial";
    }

    // 4. Update Ledger status & total_paid
    const { data: updatedLedger, error: updateError } = await supabase
      .from("student_fees_ledger")
      .update({
        total_paid,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ledger_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 5. Send Notification (EV-005: Fee Received)
    try {
      const student = ledger.students as any;
      if (student) {
        const message = `Hello ${student.full_name},\n\nWe have received your payment of ₹${amount_paid} via ${payment_mode}.\nReceipt Number: ${receipt_number}\n\nRemaining Balance: ₹${due_amount - total_paid}\n\nThank you for choosing Rohit Computer Institute!\n\nBest regards,\nRohit Computer Institute`;

        if (student.email) {
          await NotificationService.send("Email", {
            to: student.email,
            title: "Fee Payment Receipt - RCI",
            message,
            userId: student.id,
          });
        }

        if (student.phone) {
          await NotificationService.send("SMS", {
            to: student.phone,
            title: "Fee Received",
            message: `RCI: Payment of Rs.${amount_paid} received. Receipt: ${receipt_number}. Balance: Rs.${due_amount - total_paid}.`,
            userId: student.id,
          });
        }
      }
    } catch (notifErr: any) {
      console.error("Fee payment notification dispatch failed:", notifErr.message);
    }

    return NextResponse.json({
      success: true,
      transaction,
      ledger: updatedLedger,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
