import { CreatedIcon } from "@/assets/icons/components";

export const getSuccessToast = (
  moduleName: string,
  action: "created" | "updated" | "deleted"
) => ({
  title: `${moduleName} ${action}!`,
  description: `${moduleName} ${action} successfully.`,
  type: "success" as const,
  icon: <CreatedIcon />,
});

export const getErrorToast = (
  action: string,
  moduleName: string
) => ({
  title: "Failed!",
  description: `Unable to ${action} ${moduleName.toLowerCase()}.`,
  type: "error" as const,
});