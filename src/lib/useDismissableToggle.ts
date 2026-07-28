"use client";
import { useEffect, useRef, useState } from "react";

// Shared open/close-on-outside-click/Escape behavior for dropdown-style triggers
// (nav dropdowns, utility-bar menus). Extracted so the interaction logic lives in
// one place instead of being copied per component (coding-standards §1).
export function useDismissableToggle<T extends HTMLElement>() {
  const [open, setOpen] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return { open, toggle: () => setOpen((v) => !v), ref };
}
