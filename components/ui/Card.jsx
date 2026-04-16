import { cn } from "@/lib/utils";

export default function Card({ className, children }) {
  return <div className={cn("surface p-5 sm:p-6", className)}>{children}</div>;
}