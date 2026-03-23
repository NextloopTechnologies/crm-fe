export enum LeadStage {
  LEAD        = 'LEAD',
  QUALIFIED   = 'QUALIFIED',
  PROPOSAL    = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON  = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  UNQUALIFIED = 'UNQUALIFIED',
  INACTIVE    = 'INACTIVE',
}

export enum LeadSource {
  WEBSITE  = 'WEBSITE',
  DISCORD  = 'DISCORD',
  WHATSAPP = 'WHATSAPP',
  REFERRAL = 'REFERRAL',
  LINKEDIN = 'LINKEDIN',
  MANUAL   = 'MANUAL',
}

export enum InteractionType {
  CALL     = 'CALL',
  EMAIL    = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  MEETING  = 'MEETING',
  NOTE     = 'NOTE',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN       = 'ADMIN',
  MANAGER     = 'MANAGER',
  SALES_EXEC  = 'SALES_EXEC',
  VIEWER      = 'VIEWER',
}

export enum TaskStatus {
  PENDING     = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED   = 'COMPLETED',
  CANCELLED   = 'CANCELLED',
}

export enum ProjectStatus {
  ACTIVE    = 'ACTIVE',
  ON_HOLD   = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ClientStatus {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PAST     = 'PAST',
}
