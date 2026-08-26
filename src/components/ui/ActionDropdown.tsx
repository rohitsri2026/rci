"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface ActionDropdownProps {
  /** Accessible label for the trigger button */
  ariaLabel?: string;
  /** Optional custom trigger icon/content */
  triggerIcon?: React.ReactNode;
  /** Optional custom class for the trigger button */
  triggerClassName?: string;
  /** Optional custom class for the dropdown menu container */
  menuClassName?: string;
  /** Render function or children. Receives `{ close }` function */
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  /** Controlled open state (optional) */
  isOpen?: boolean;
  /** Controlled onOpenChange callback (optional) */
  onOpenChange?: (open: boolean) => void;
}

export default function ActionDropdown({
  ariaLabel = "Actions menu",
  triggerIcon,
  triggerClassName = "w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600/30 outline-none",
  menuClassName = "w-52 bg-white rounded-xl border border-slate-200/90 shadow-xl p-1 text-left space-y-0.5",
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
}: ActionDropdownProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(open);
    }
    onOpenChange?.(open);
  };

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    maxHeight?: number;
  }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = () => setIsOpen(false);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const safeMargin = 12;

    const menuHeight = menuRef.current ? menuRef.current.offsetHeight : 220;
    const menuWidth = menuRef.current ? menuRef.current.offsetWidth : 208;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let styleTop: number | undefined;
    let styleBottom: number | undefined;
    let styleMaxHeight: number | undefined;

    if (spaceBelow >= menuHeight + safeMargin) {
      // Position downward below trigger
      styleTop = triggerRect.bottom + 4;
    } else if (spaceAbove >= menuHeight + safeMargin) {
      // Position upward above trigger
      styleBottom = viewportHeight - triggerRect.top + 4;
    } else {
      // Insufficient space both sides — pick side with larger space and apply scroll
      if (spaceBelow >= spaceAbove) {
        styleTop = triggerRect.bottom + 4;
        styleMaxHeight = Math.max(100, spaceBelow - safeMargin - 4);
      } else {
        styleBottom = viewportHeight - triggerRect.top + 4;
        styleMaxHeight = Math.max(100, spaceAbove - safeMargin - 4);
      }
    }

    // Horizontal alignment: right-aligned with trigger right edge by default
    let styleRight: number | undefined = viewportWidth - triggerRect.right;
    let styleLeft: number | undefined = undefined;

    if (styleRight !== undefined && styleRight < safeMargin) {
      styleRight = safeMargin;
    }
    const computedLeft = viewportWidth - (styleRight ?? safeMargin) - menuWidth;
    if (computedLeft < safeMargin) {
      styleRight = undefined;
      styleLeft = safeMargin;
    }

    setCoords({
      top: styleTop,
      bottom: styleBottom,
      left: styleLeft,
      right: styleRight,
      maxHeight: styleMaxHeight,
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Re-calculate after menu mounts/renders to get exact height
    const timer = setTimeout(() => {
      calculatePosition();
    }, 0);

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, { capture: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={triggerClassName}
      >
        {triggerIcon || <MoreVertical className="w-4 h-4" />}
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: coords.top !== undefined ? `${coords.top}px` : undefined,
              bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
              left: coords.left !== undefined ? `${coords.left}px` : undefined,
              right: coords.right !== undefined ? `${coords.right}px` : undefined,
              maxHeight: coords.maxHeight !== undefined ? `${coords.maxHeight}px` : undefined,
              overflowY: coords.maxHeight !== undefined ? "auto" : undefined,
              zIndex: 9999,
            }}
            className={`animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
          >
            {typeof children === "function" ? children({ close }) : children}
          </div>,
          document.body
        )}
    </>
  );
}
