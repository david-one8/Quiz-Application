import { cn } from "@/lib/utils";

export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    primary: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
  };

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles[variant])}>
      {children}
    </span>
  );
}