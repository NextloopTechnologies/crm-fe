import { LEAD_STATUS_OPTIONS_LIST } from "@/constants/LeadStatus";

type LeadStatusKey = (typeof LEAD_STATUS_OPTIONS_LIST)[number]["value"];

const STATUS_VALUES = LEAD_STATUS_OPTIONS_LIST.map((option) => option.value);

const normalizeStatus = (status?: string): LeadStatusKey => {
  if (!status) return "New Lead";

  const normalized = status.trim().toLowerCase();
  const match = STATUS_VALUES.find((value) => value.toLowerCase() === normalized);

  return (match ?? "New Lead") as LeadStatusKey;
};

export const getAvailableStatuses = (currentStatus?: string): string[] => {
  const key = normalizeStatus(currentStatus);
  return STATUS_VALUES.filter((value) => value !== key);
};