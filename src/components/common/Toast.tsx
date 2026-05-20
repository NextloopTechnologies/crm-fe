import { toast } from "sonner"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  icon?: React.ReactNode  // ← add karo
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
}

const styles: Record<ToastType, { bg: string; border: string; title: string }> = {
  success: { bg: "#FFFFFF", border: "#0BD90180", title: "#262626" },
  error:   { bg: "#fef2f2", border: "#fca5a5",   title: "#dc2626" },
  warning: { bg: "#fffbeb", border: "#fcd34d",   title: "#d97706" },
  info:    { bg: "#eff6ff", border: "#93c5fd",   title: "#2563eb" },
}

export function showToast({
  title,
  description,
  type = "info",
  icon,
  position = "top-right",
}: ToastOptions) {
  const s = styles[type]

  toast(title, {
    description,
    position,
    icon: icon ? (
      <div style={{ width: "44px", height: "44px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
    ) : null,
    style: {
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "10px",
        padding: "12px 16px",
        color: s.title,
        display: "flex",
        alignItems: "center",
        gap: "32px",
      },
    descriptionClassName: "text-xs mt-0.5",
  })
}