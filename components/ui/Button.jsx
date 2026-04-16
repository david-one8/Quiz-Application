import { cn } from "@/lib/utils";

export default function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        variant === "primary" ? "btn-primary" : "btn-secondary",
        className
      )}
      {...props}
    />
  );
}