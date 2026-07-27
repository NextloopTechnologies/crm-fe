export const CHART_COLORS = {
  primary: "#4f6ef7",
  success: "#22c55e",
  warning: "#f59e0b",
  purple: "#a855f7",
  danger: "#ef4444",
};

export const ACCOUNT_COLORS = Object.values(CHART_COLORS);

export const SOURCE_COLORS: Record<string, string> = {
  Web: CHART_COLORS.primary,
  Email: CHART_COLORS.success,
  Phone: CHART_COLORS.warning,
  Partner: CHART_COLORS.purple,
  Other: CHART_COLORS.danger,
};