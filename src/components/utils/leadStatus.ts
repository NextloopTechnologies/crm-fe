import { LEAD_STATUS_OPTIONS } from "@/constants/LeadStatus";

const STATUS_KEYS = Object.keys(LEAD_STATUS_OPTIONS) as LeadStatusKey[];

type LeadStatusKey = keyof typeof LEAD_STATUS_OPTIONS;  // typeof lagao

const normalizeStatus = (status?: string): LeadStatusKey => {
  if (!status) return "None";
  if (status in LEAD_STATUS_OPTIONS) return status as LeadStatusKey;
  
  const match = STATUS_KEYS.find(
    (key) => key.toLowerCase() === status.toLowerCase()
  );
  return match ?? "None";
};

export const getAvailableStatuses = (currentStatus?: string): string[] => {
  const key = normalizeStatus(currentStatus);
  return [...LEAD_STATUS_OPTIONS[key]]; // readonly fix bhi
};