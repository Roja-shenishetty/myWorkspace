import { useRef,useState,useEffect } from "react";
import useOnClickOutside from "./atoms/useOnClickOutside";
import ChevronDown from "./atoms/ChevronDown";
/**
 * Props
 * - label: string | ReactNode  (button label)
 * - align: 'start' | 'end' | 'center' (panel alignment; default 'start')
 * - singleColumn: boolean       (wraps children in a single-column grid; default false)
 * - panelClassName: string      (extra classes for the panel)
 * - buttonClassName: string     (extra classes for the trigger button)
 */
export function Dropdown({
  label,
  children,
  align = "start",
  singleColumn = false,
  panelClassName = "",
  buttonClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  // Close on Escape for basic a11y
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Alignment helpers
  const alignClass =
    align === "end"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";

  return (
    <div className="relative h-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={[
          "group inline-flex items-center justify-center text-sm",
          "focus:outline-none hover:bg-accent",
          "w-max p-2 bg-transparent border-0 border-b-2 border-transparent font-normal rounded-none",
          "text-foreground-light hover:text-foreground h-full",
          "focus-visible:rounded transition-all",
          "focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600",
          buttonClassName,
        ].join(" ")}
      >
        {label}
        <ChevronDown
          className={`relative top-[1px] ml-1 h-3 w-3 transition duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel */}
      {open && (
        <div
          className={[
            "absolute top-full mt-2",
            alignClass,
            "min-w-[16rem] max-w-[90vw] z-[60]",
            // OPAQUE, high-contrast panel + clear border/shadow:
            "bg-white dark:bg-neutral-900",
            "text-gray-800 dark:text-gray-100",
            "border border-black/10 dark:border-white/10",
            "shadow-lg rounded-md p-4",
            panelClassName,
          ].join(" ")}
        >
          {singleColumn ? (
            <div className="grid grid-cols-1 gap-4">{children}</div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}