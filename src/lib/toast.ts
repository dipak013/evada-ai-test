type ToastType = "success" | "error" | "info";

const toastTarget = new EventTarget();

export function emitToast(message: string, type: ToastType = "info") {
  toastTarget.dispatchEvent(new CustomEvent("toast", { detail: { message, type } }));
}

export function onToast(cb: (payload: { message: string; type: ToastType }) => void) {
  const handler = (e: Event) => {
    const ev = e as CustomEvent;
    cb(ev.detail);
  };
  toastTarget.addEventListener("toast", handler as EventListener);
  return () => toastTarget.removeEventListener("toast", handler as EventListener);
}

export default { emitToast, onToast };
