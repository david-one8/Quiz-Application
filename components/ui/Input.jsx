import { forwardRef, useId } from "react";

const Input = forwardRef(({ label, error, ...props }, ref) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <input id={inputId} ref={ref} className="input" {...props} />
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
