import { toast } from "sonner"
import React from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  icon?: React.ReactNode  // ← bahar se pass karenge
}

const configs: Record<ToastType, {
  border: string
  iconBg: string
  iconColor: string
}> = {
  success: { border: "#16a34a", iconBg: "#e6faf0", iconColor: "#16a34a" },
  error:   { border: "#dc2626", iconBg: "#fef2f2", iconColor: "#dc2626" },
  warning: { border: "#d97706", iconBg: "#fffbeb", iconColor: "#d97706" },
  info:    { border: "#2563eb", iconBg: "#eff6ff", iconColor: "#2563eb" },
}

export function showToast({
  title,
  description,
  type = "success",
  icon,
}: ToastOptions) {
  const { border, iconBg } = configs[type]

  toast(title, {
    description,
    position: "top-right",
    icon: icon ? (
      <div style={{
        width: "44px",
        height: "44px",
        flexShrink: 0,
        borderRadius: "8px",
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {icon}
      </div>
    ) : null,
    style: {
      background: "#FFFFFF",
      border: `1.5px solid ${border}`,
      borderRadius: "10px",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
      borderRight: "none",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: "38px",
      width: "340px",
      marginRight: "0",
    },
    descriptionClassName: "text-xs mt-0.5 text-muted-foreground",
  })
}