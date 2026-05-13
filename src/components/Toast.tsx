import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType }

let _id = 0;
const _listeners: Array<(t: ToastItem[]) => void> = [];
let _toasts: ToastItem[] = [];

function notify() { _listeners.forEach((fn) => fn([..._toasts])); }

export function toast(message: string, type: ToastType = "info") {
  const item = { id: _id++, message, type };
  _toasts = [..._toasts, item];
  notify();
  setTimeout(() => { _toasts = _toasts.filter((t) => t.id !== item.id); notify(); }, 4000);
}

const styles: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-gray-800 text-white",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  useEffect(() => {
    _listeners.push(setToasts);
    return () => { const i = _listeners.indexOf(setToasts); if (i !== -1) _listeners.splice(i, 1); };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm ${styles[t.type]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
