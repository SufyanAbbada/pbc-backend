import {
  JobApplicationStatus,
  JobStatus,
  GeneralStatus,
  TicketPriority,
  TicketStatus,
  PolicyType,
  ElectionType,
  EventMOMApprovalStatus,
  TaskStatus,
  Interaction,
  InteractionType,
  UserNotificationStatus,
  AgreeOrNot,
  LeadStatus,
  ElectionState,
  EventAttendanceStatus,
  JobType,
  JobMode,
  EventType,
  InitiativeStatus,
  WishlistStatus,
} from "./enums";

export interface CartItem {
  productId: string;
  productName: string;
  seller: string;
  sellerId: number;
  price: number;
  productImage: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface Constitution {
  title: string;
  version?: string;
  isEditable: boolean;
  lastEditedBy: number;
}

export interface Article {
  title: string;
  content: string;
}

export interface Discount {
  title: string;
  description: string;
  value: number;
  discountCode: string;
  startDate: Date;
  validUntil: Date;
  isFeatured: boolean;
  userId: number;
}

export interface Lead {
  buyerId: number;
  sellerId: number;
  productId: number;
  status: LeadStatus;
}

export interface Order {
  userId: number;
  items: Array<CartItem>;
  originalPrice: number;
  discountedPrice: number;
  addressId: number;
  transactionId: string;
  isDiscountApplied?: boolean;
  discountValue: number;
}

export interface Otp {
  userId: number;
  otp: string;
  expiresAt: Date;
}

export interface ProductData {
  name: string;
  price: number;
  description: string;
  userId: number;
  categoryId: number;
  primaryImage: string;
  secondaryImage?: string;
}

export interface ProfileData {
  userId: number;
  bio?: string | null;
  bioVideo: string;
  country: string;
  facebookSocial?: string | null;
  linkedInSocial?: string | null;
  calendlyLink?: string | null;
  profilePicture?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  tradeLicense: string;
  passport: string;
  emiratesId: string;
}

export interface BasicUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: number;
  isContactsVerfied?: boolean;
}

export interface TempUser {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  emailOtpExpiry: Date;
  phoneOtpExpiry: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  name?: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
  facebookSocial?: string;
  linkedInSocial?: string;
  calendlyLink?: string;
}

export interface UserRejection {
  reason: string;
  email: string;
  phoneNumber: string;
  rejectedBy: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface quoteData {
  userId: number;
  rfqId: number;
  description: string;
  primaryImage?: string;
  secondaryImage?: string;
  price: number;
  termsAndConditions: string;
  timeline: string;
  isAwarded?: boolean;
}
export interface RfqData {
  title: string;
  description: string;
  userId: number;
  categoryName: string;
  primaryImage?: string;
  secondaryImage?: string;
  budget: number;
  quantity: number;
  deadline: string;
  productId?: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  originalPrice: number;
  discountedPrice: number;
  isDiscountApplied: boolean;
  discountValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  dateOfBirth: Date;
  passportNumber: string;
  passportExpiryDate: Date;
  emiratesId: string;
  emiratesIdExpiryDate: Date;
  mailingAddress: string;
}

export interface BusinessInfo {
  companyName: string;
  city: string;
  country: string;
  tradeLicenseNumber: string;
  yearOfEstablishment: number;
  affiliation: string;
  legalStatus: string;
  natureOfBusiness: string;
  businessGroup: NonNullable<BusinessGroup["id"]>[];
  keywords: string[];
  hsCodes: string[];
  website: string;
  noOfEmployees: number;
  vatRegistrationNumber: string;
  tradeLicenseExpiry: Date;
  emiratesIssuingAuthority: string;
}

export interface BusinessGroup {
  id?: number;
  name: string;
  description?: string;
}

export interface MembershipSpecificInfo {
  keyObjectives: string[];
  areaOfInterest: string[];
  selfDescription: string;
  membershipCategory: string;
  councilDiscoveryMethod: string;
  expectations: string;
  businessTrainingInterest: AgreeOrNot;
  clientIntroductionComfort: AgreeOrNot;
}

export interface PrimaryShareholderInfoData {
  shareHolderStatus: string;
  otherShareHoldersName: string[];
  annualRevenue?: string;
  ownershipPercentage?: number;
}

export interface SecondaryShareholderInfo {
  references: string[];
}

export interface ProfessionalInfo {
  professionalTitle: string;
  primeClients: string[];
  languagesSpoken: string[];
  yearsOfExperience: number;
}

export interface MembershipType
  extends PersonalInfo,
    BusinessInfo,
    MembershipSpecificInfo,
    PrimaryShareholderInfoData,
    SecondaryShareholderInfo,
    ProfessionalInfo {
  userId: number;
}

export interface MembershipApproval {
  userId: number;
  membershipId: number;
  status: GeneralStatus;
  comment: string;
}

export interface Address {
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface CreateSubscriptionResponse {
  data: {
    subscription_no?: string;
  };
}

export interface GetSubscriptionResponse {
  message: string;
  data?: {
    message?: string;
    data?: {
      customer?: {
        name?: string;
        email?: string;
        mobile?: string;
        card_last_four?: string | null;
      };
      plan?: {
        name?: string;
        type?: string;
        amount?: string;
        unit?: string;
        setup_fee?: number;
        status?: string;
        created?: string;
      };
      invoices?: {
        id: number;
        subscription_id: number;
        billing_type: string;
        billing_count: number;
        bill_date: string;
        status: string;
      }[];
    };
  };
}

export interface PaginationResponse {
  message: string;
  data: any[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
export interface Policy {
  userId: number;
  title: string;
  description: string;
  type: PolicyType;
  status: GeneralStatus;
  articleId?: number;
  newVersion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Election {
  title: string;
  description: string;
  type: ElectionType;
  startDate: Date;
  endDate: Date;
  policyId?: number;
  candidates?: {
    connect: { id: number }[];
  };
  pollOptions?: string[];
  winningOption?: string;
  winningPollVotes?: number;
  policyVotes?: string;
  electedVotes?: number;
  electedId?: number;
  outcome?: string;
  state: ElectionState;
}

export interface Vote {
  userId: number;
  vote: string;
  electionId: number;
}

export interface requestOrResponseBody {
  [key: string]:
    | string
    | null
    | undefined
    | object
    | Array<requestOrResponseBody>;
}

export interface Wishlist {
  userId: number;
  title: string;
  suggestions: string;
  comment?: string;
  status: WishlistStatus;
}

export interface JobCategory {
  name: string;
  slug: string;
}

export interface JobPost {
  title: string;
  description: string;
  deadline: Date;
  jobCategoryId: number;
  userId: number;
  status?: JobStatus;
  acceptedJobApplicationId?: number;
  minExperience?: number;
  maxExperience?: number;
  jobType?: JobType;
  jobMode?: JobMode;
  location: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  minSalary?: number;
  maxSalary?: number;
  skills: number[];
}

export interface JobApplication {
  jobPostId: number;
  applicantName: string;
  linkedInProfile?: string;
  resumeDoc: string;
  status?: JobApplicationStatus;
}

export interface TransactionCategory {
  name: string;
  slug: string;
}

export interface Transaction {
  zohoExpenseId: string;
  title: string;
  categoryId: number;
  userId: number;
  amount: number;
  notes?: string;
  primaryImage: string;
  secondaryImage?: string;
  status?: GeneralStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketCategory {
  name: string;
  slug: string;
}

export interface Ticket {
  title: string;
  description: string;
  status?: TicketStatus;
  priority: TicketPriority;
  userId: number;
  categoryId: number;
  primaryImage?: string;
  secondaryImage?: string;
  tertiaryImage?: string;
}

export interface Initiative {
  userId: number;
  title: string;
  description: string;
  status: InitiativeStatus;
}

export interface Response {
  ticketId?: number;
  wishlistId?: number;
  taskId?: number;
  quoteId?: number;
  initiativeId?: number;
  userId: number;
  response: string;
}

export interface Event {
  title: string;
  venue: string;
  details: string;
  startDate: Date;
  endDate: Date;
  eventType: EventType;
  userId: number;
  eventMOM?: string;
  eventMOMStatus?: EventMOMApprovalStatus;
  eventMOMEditorId?: number;
}

export interface EventMedia {
  eventId: number;
  assetURL: string;
}

export interface EventAssignee {
  eventId: number;
  userId: number;
}

export interface EventMOMApproval {
  eventId: number;
  userId: number;
  status: EventMOMApprovalStatus;
  comment?: string;
}

export interface EventAttendance {
  eventId: number;
  userId: number;
  status: EventAttendanceStatus;
}

export interface Task {
  title: string;
  description: string;
  assignees: {
    connect: { id: number }[];
  };
  assignerId: number;
  status: TaskStatus;
}

export interface Attendance {
  userId: number;
  clockIn: Date;
  locationIn: string;
  clockOut?: Date;
  locationOut?: string;
  tasks?: string;
}

export interface ActivityLog {
  id?: number;
  observerId: number;
  interactedUserId: number;
  interaction?: Interaction;
  interactionType: InteractionType;
}

interface ActivityLogUser {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface FullActivityLog extends ActivityLog {
  Observer: ActivityLogUser;
  InteractedUser: ActivityLogUser;
  createdAt: Date;
}

export interface UserNotification {
  userId: number;
  message: string;
  status: UserNotificationStatus;
}

export interface ExpoPushTicket {
  id?: string;
  status: string;
  message?: string;
  details?: {
    error?: string;
  };
}

export interface ZohoExpenseAccount {
  account_type: string;
  account_name: string;
  account_id: string;
}
