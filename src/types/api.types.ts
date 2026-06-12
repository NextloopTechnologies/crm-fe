// ── Common API wrappers ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export interface ApiError {
  message: string
  status: number
  timestamp: string
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  fullname: string
  roleName: string
  managerId: string
  orgnizationId: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  roleName: string
  managerId: string
  orgnizationId: string
  fullname: string
}

export interface LoginForm {
    email: string
    password: string
    rememberMe?: boolean
}

export interface RegisterRequest {

  userName : string
  password: string
  email : string
  roleName : string 
  firstName : string 
  lastName : string 
  phone : string 

}



// ── Lead ──────────────────────────────────────────────────────────────────────
export interface Lead {
  id: number
  name: string
  company?: string
  email: string
  phone?: string
  source: string
  stage: string
  dealValue?: number
  probability?: number
  ownerId: number
  ownerName: string
  lastActivity: string
  createdAt: string
  notes?: string
}
export interface AddressRequestDto {
  country: string
  flatNo: string
  street: string
  city: string
  state: string
  zipCode: string
  latitude:string
  longitude:string
  organizationId: string
}
export interface CreateLeadRequest {
  company?: string
  lastName: string
  firstName: string
  title?: string
  email: string
  phone?: string
  fax?: string
  mobile: string
  website?: string
  leadSource: string
  leadStatus: string
  industry?: string
  noOfEmployees?: string
  annualRevenue?: string
  rating?: string
  emailOptOut?: boolean
  skypeId?: string
  secondaryEmail?: string
  twitter?: string

  leadAddressRequestDto: AddressRequestDto
}

export interface CreateAccountRequest {
  accountName: string
  accountSite?: string
  accountType?: string
  rating?: string
  website?: string
  tickerSymbol?: string
  ownership?: string
  parentAccount?: string
  employees?: string
  annualRevenue?: string

  contacts?: ContactRequestDto[]
  addresses?: AccountAddressRequestDto[]
}

export interface ContactRequestDto {
  title?: string
  firstName?: string
  lastName?: string
  email?: string
  secondaryEmail?: string
  phone?: string
  mobile?: string
  skypeId?: string
  designation?: string
  department?: string
  dateOfBirth?: string
  fax?: string
}

export interface AccountAddressRequestDto {
  addressType?: string
  country?: string
  flatNo?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
  latitude?: string
  longitude?: string
}

export interface CreateTaskRequest {
  subject: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  // Related To
  accountNumber: string;
  contactId: string;
  isReminder: boolean;
  isRepeat: boolean;
  relatedToType: string;
  repeatDetails : {
  repeatType: string;
  frequency: string;
  everyX: number;
  endType: string;
  endAfterTimes: number;
  endOnDate: string;
  }
}

export interface CreateUserRequest {

  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  username?: string 
  password?: string
  roleName?: string
  assignToManagerUsername?: string

}
export interface CreateProjectRequest {
  projectName: string;
  description: string;
  projectStatus: string;
  projectType: string;
  endDate: string;
  startDate: string;

}

// ── Client ────────────────────────────────────────────────────────────────────
export interface Client {
  id: number
  company: string
  industry?: string
  email?: string
  phone?: string
  website?: string
  status: string
  relationshipOwnerId: number
  relationshipOwnerName: string
  createdAt: string
}

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
  id: number
  clientId: number
  clientName: string
  title: string
  status: string
  startDate: string
  endDate?: string
  createdAt: string
}

// ── Interaction ───────────────────────────────────────────────────────────────
export interface Interaction {
  id: number
  leadId: number
  type: string
  notes: string
  createdBy: number
  createdByName: string
  interactedAt: string
}

// ── Notification ──────────────────────────────────────────────────────────────
export interface Notification {
  id: number
  message: string
  type: string
  isRead: boolean
  leadId?: number
  createdAt: string
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
export interface PipelineBoard {
  lead: Lead[]
  qualified: Lead[]
  proposal: Lead[]
  negotiation: Lead[]
  closedWon: Lead[]
  closedLost: Lead[]
}

export interface PipelineStats {
  totalLeads: number
  activeDeals: number
  totalRevenue: number
  wonThisMonth: number
  lostThisMonth: number
  conversionRate: number
}
