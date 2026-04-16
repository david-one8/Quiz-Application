export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input className="input" {...props} />
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}