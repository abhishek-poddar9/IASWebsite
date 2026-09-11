export default function StatusBadge({ value }) {
  return (
    <span
      className={`badge ${String(value).toLowerCase().replaceAll(" ", "-")}`}
    >
      {value}
    </span>
  );
}
