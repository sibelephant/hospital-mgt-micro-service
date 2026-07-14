export function StatusList({ items }: { items: string[][] }) {
  return (
    <ul className="m-0 grid list-none gap-0 p-0">
      {items.map(([label, value]) => (
        <li className="flex justify-between gap-4 border-b border-blue-100 py-3 last:border-b-0" key={label}>
          <span className="text-slate-500">{label}</span>
          <strong>{value}</strong>
        </li>
      ))}
    </ul>
  );
}
