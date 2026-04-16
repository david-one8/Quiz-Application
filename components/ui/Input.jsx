import { useId } from "react";

export default function Input({ label, error, ...props }) {
  const generatedId = useId();
  const inputId = props.id || generatedId;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <input id={inputId} className="input" {...props} />
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}
