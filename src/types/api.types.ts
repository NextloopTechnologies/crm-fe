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
  id?: string | number
  leadNumber: string
  firstName: string
  lastName: string
  leadOwner: string
  company?: string
  email: string
  phone: string
    leadSource: string
  leadStatus: string
  creationDate: string
  lastModifiedDate: string
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
  leadOwner : string
  leadNumber: string
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
  creationDate?: string
  leadAddressRequestDto: AddressRequestDto
}
export interface UpdateLeadRequest
  extends Partial<CreateLeadRequest> {}
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
  accountOwner?: string
  accountNumber?: string
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
  isReminder: string;
  isRepeat: string;
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
  teamMember?: string
  clientId?: string

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

export interface Profile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleName: string;
  avatar?: string;
  isActive: boolean;
  creationDate: string;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roleName: string;
  creationDate: string;
  username: string;
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

// ─────────────────────────────────────────────────────────────
// Invoice DTOs
// ─────────────────────────────────────────────────────────────

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";

export interface InvoiceItemDto {
  itemDetails: string;   // description / name of the item
  quantity: number;
  rate: number;
  amount: number;        // auto-calculated: quantity * rate
}

export interface CreateInvoiceRequest {
  invoiceDate: string;         // ISO date string  e.g. "2026-06-18"
  dueDate: string;             // ISO date string  e.g. "2026-06-30"
  status: InvoiceStatus;
  description?: string;

  // Line items
  items: InvoiceItemDto[];

  // Totals
  subTotal: number;
  discount: number;            // flat amount in Rs.
  tax: number;                 // percentage  e.g. 18 → 18%
  grandTotal: number;          // auto-calculated

  // Bank details
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;

  // Link to account (passed from AccountDetailPage)
  accountNumber_ref?: string;  // the accountNumber from Account
  orderNumber?: string;
}

// Response shape returned by the API after create/fetch
export interface InvoiceResponseDto extends CreateInvoiceRequest {
  id: string;
  invoiceNumber: string;       // e.g. "INV_00001111"  — generated by backend
  customerName: string;
  createdAt: string;
  updatedAt: string;
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
