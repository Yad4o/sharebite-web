type Status = string;

const map: Record<string, { label: string; cls: string }> = {
  available: { label: "Available", cls: "bg-green-100 text-green-700" },
  requested: { label: "Requested", cls: "bg-amber-100 text-amber-700" },
  accepted: { label: "Accepted", cls: "bg-blue-100 text-blue-700" },
  picked_up: { label: "Picked up", cls: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", cls: "bg-gray-100 text-gray-600" },
  expired: { label: "Expired", cls: "bg-red-100 text-red-600" },
  cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-400" },
  pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-700" },
  delivery_accepted: { label: "Delivery assigned", cls: "bg-blue-100 text-blue-700" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}
