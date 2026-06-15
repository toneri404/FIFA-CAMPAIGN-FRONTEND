function Toast({ toast }) {
  if (!toast) return null;

  const isSuccess =
    toast.type === "success";

  return (
    <div
      style={{
        position: "fixed",
        top: "90px",
        right: "25px",
        zIndex: 9999,
        background: isSuccess
          ? "rgba(34,197,94,0.15)"
          : "rgba(239,68,68,0.15)",
        border: isSuccess
          ? "1px solid #22c55e"
          : "1px solid #ef4444",
        color: isSuccess
          ? "#86efac"
          : "#fca5a5",
        padding: "14px 18px",
        borderRadius: "14px",
        fontWeight: "700",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)"
      }}
    >
      {isSuccess ? "✅" : "⚠️"} {toast.message}
    </div>
  );
}

export default Toast;