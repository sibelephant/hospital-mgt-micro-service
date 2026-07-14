export function AuthField({
  label,
  name,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-blue-950">
      {label}
      <input
        className="min-h-10 rounded-lg border border-blue-100 px-3 font-normal text-slate-800 outline-none focus:border-blue-400"
        onChange={(event) => onChange(name, event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}
