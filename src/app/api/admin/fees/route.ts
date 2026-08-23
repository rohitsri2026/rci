import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/auth";

export async function GET(request: Request) {
  const supabase = await createClient();
  
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const queryParam = searchParams.get("query");

  try {
    let query = supabase
      .from("student_fees_ledger")
      .select(`
        *,
        students:student_id (
          id,
          full_name,
          email,
          phone,
          courses:course_id (
            id,
            course_name,
            fees
          )
        ),
        fee_plans:fee_plan_id (
          id,
          plan_name,
          total_amount,
          installments_count
        ),
        fee_transactions (
          id,
          amount_paid,
          payment_mode,
          receipt_number,
          paid_at
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: ledgers, error } = await query;
    if (error) throw error;

    let filteredLedgers = ledgers || [];
    if (queryParam) {
      const q = queryParam.toLowerCase();
      filteredLedgers = filteredLedgers.filter((l: any) => 
        l.students?.full_name?.toLowerCase().includes(q) ||
        l.students?.email?.toLowerCase().includes(q) ||
        l.students?.phone?.includes(q)
      );
    }

    return NextResponse.json(filteredLedgers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
