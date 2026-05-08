// components/common/AlertPopupDialog.tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type AlertVariant = "danger" | "warning" | "success" | "info";

interface AlertPopupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Content
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  variant?: AlertVariant;

  // Buttons
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;

  // Optional
  loading?: boolean;
  className?: string;
}

// ── Variant Styles ────────────────────────────────────────────────────────────
const variantConfig: Record<
  AlertVariant,
  { iconBg: string; iconColor: string; confirmBtn: string }
> = {
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    confirmBtn:
      "bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-300",
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmBtn:
      "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-300",
  },
  success: {
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    confirmBtn:
      "bg-green-500 hover:bg-green-600 text-white focus-visible:ring-green-300",
  },
  info: {
    iconBg: "bg-[#f0efff]",
    iconColor: "text-[#5752FE]",
    confirmBtn:
      "bg-[#5752FE] hover:bg-[#4a45e0] text-white focus-visible:ring-[#a5a2fe]",
  },
};

// ── Default Icons ─────────────────────────────────────────────────────────────
const DefaultIcons: Record<AlertVariant, ReactNode> = {
  danger: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  success: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  info: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

// ── Component ─────────────────────────────────────────────────────────────────
export function AlertPopupDialog({
  open,
  onOpenChange,
  icon,
  title,
  subtitle,
  variant = "danger",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
  loading = false,
  className,
}: AlertPopupDialogProps) {
  const styles = variantConfig[variant];
  const resolvedIcon = icon ?? DefaultIcons[variant];

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    if (!loading) onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          "max-w-[400px] rounded-2xl p-6 gap-0 border border-[#ECECEC] shadow-xl",
          className
        )}
      >
        <AlertDialogHeader className="flex flex-col items-center text-center gap-3 mb-5">
          {/* Icon */}
          <div
            className={cn(
              "h-14 w-14 rounded-full flex items-center justify-center",
              styles.iconBg,
              styles.iconColor
            )}
          >
            {resolvedIcon}
          </div>

          {/* Title */}
          <AlertDialogTitle className="text-[#111127] text-lg font-semibold leading-snug">
            {title}
          </AlertDialogTitle>

          {/* Subtitle */}
          {subtitle && (
            <AlertDialogDescription className="text-[#6b6b8d] text-sm leading-relaxed">
              {subtitle}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* Buttons */}
        <AlertDialogFooter className="flex-row gap-3 mt-2 sm:justify-center">
          <AlertDialogCancel
            onClick={handleCancel}
            className="flex-1 h-10 rounded-[10px] border border-[#e4e4ee] text-[#6b6b8d] text-sm font-medium hover:bg-[#f5f5fb] hover:text-[#111127] transition-colors"
          >
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "flex-1 h-10 rounded-[10px] text-sm font-medium transition-colors",
              styles.confirmBtn
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading...
              </span>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}