export enum GeneralStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum UpdateGeneralStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum WishlistStatus {
  PENDING = "PENDING",
  RESOLVED_AND_CLOSED = "RESOLVED_AND_CLOSED",
  UNRESOLVED_AND_CLOSED = "UNRESOLVED_AND_CLOSED",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inActive",
}

export enum AssetTypes {
  DOCUMENTS = "documents",
  IMAGES = "images",
  VIDEOS = "videos",
  MEDIA = "Media",
  AUDIOS = "audios",
}

export enum SourceType {
  PARAM = "param",
  BODY = "body",
  HEADERS = "headers",
  QUERY = "query",
}

export enum CartStatus {
  ACTIVE = "ACTIVE",
  CHECKED_OUT = "CHECKED_OUT",
}

export enum LeadStatus {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
}

export enum RfqStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  AWARDED = "AWARDED",
}

export enum PaymentMethod {
  BANKTRANSFER = "BANKTRANSFER",
  CARD = "CARD",
  CHEQUE = "CHEQUE",
}

export enum PlanType {
  MEMBER_PLAN = "Member plan",
}

export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FILLED = "FILLED",
}

export enum JobApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum MembershipCategory {
  CATEGORY_A = "Category A: Dubai based Pakistani Corporate Business Membership",
  CATEGORY_B = "Category B: Dubai based Pakistani Individual Membership",
  CATEGORY_C = "Category C: U.A.E. Business Membership",
  CATEGORY_D = "Category D: Non-Resident Membership",
  CATEGORY_E = "Category E: UAE National Membership",
  CATEGORY_F = "Category F: Executive Membership",
  APP_USER = "App User Membership",
}

export enum CategoryType {
  GENERAL = "GENERAL",
  TRANSACTION = "TRANSACTION",
  TICKET = "TICKET",
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum ResponseType {
  TICKET = "TICKET",
  WISHLIST = "WISHLIST",
  TASK = "TASK",
  QUOTE = "QUOTE",
  INITIATIVE = "INITIATIVE",
}

export enum InitiativeStatus {
  PLANNED = "PLANNED",
  ON_GOING = "ON_GOING",
  FINISHED = "FINISHED",
  ABORTED = "ABORTED",
}

export enum ElectionType {
  CANDIDATE_ELECTION = "CANDIDATE_ELECTION",
  POLICY_ELECTION = "POLICY_ELECTION",
  POLLING_ELECTION = "POLLING_ELECTION",
}

export enum ElectionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum ElectionState {
  ACTIVE = "ACTIVE",
  SUCCESSFUL = "SUCCESSFUL",
  UNSUCCESSFUL = "UNSUCCESSFUL",
}

export enum PolicyType {
  CONSTITUTION = "CONSTITUTION",
  POLICY = "POLICY",
}

export enum PolicyVoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

export enum PolicyVersion {
  MAJOR = "major",
  MINOR = "minor",
  PATCH = "patch",
}

export enum EventMOMApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NOT_SUBMITTED = "NOT_SUBMITTED",
}

export enum EventAttendanceStatus {
  ATTENDED = "ATTENDED",
  NOT_ATTENDED = "NOT_ATTENDED",
}

export enum EventType {
  BOARD_MEETING = "BOARD_MEETING",
  REGULAR_EVENT = "REGULAR_EVENT",
}

export enum EventActionPointStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  TRANSFERRED = "TRANSFERRED",
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum UpdateTaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
  APPROVE = "approve",
}

export enum Subject {
  ADDRESS = "Address",
  CART = "Cart",
  CATEGORY = "Category",
  CONSTITUTION = "Constitution",
  CONSTITUTION_APPROVAL = "ConstitutionApproval",
  DISCOUNT = "Discount",
  JOB_APPLICATION = "JobApplication",
  JOB_CATEGORY = "JobCategory",
  JOB_POST = "JobPost",
  JOB_SKILL = "JobSkill",
  LEAD = "Lead",
  MEMBERSHIP = "Membership",
  MEMBERSHIP_APPROVAL = "MembershipApproval",
  MEMBERSHIP_REGISTRATION = "MembershipRegistration",
  ORDER = "Order",
  PRODUCT = "Product",
  PROFILE = "Profile",
  QUOTE = "Quote",
  RFQ = "RFQ",
  TRANSACTION = "Transaction",
  TRANSACTION_CATEGORY = "TransactionCategory",
  USER = "User",
  WISHLIST = "Wishlist",
  TICKET = "Ticket",
  TICKET_CATEGORY = "TicketCategory",
  TICKET_RESPONSE = "TicketResponse",
  POLICY = "Policy",
  ELECTION = "Election",
  EVENT = "Event",
  EVENT_APPROVAL = "EventApproval",
  EVENT_ACTION_POINT = "EventActionPoint",
  EVENT_ATTENDANCE = "EventAttendance",
  VOTE = "Vote",
  TASK = "Task",
  ATTENDANCE = "Attendance",
  CHAT = "Chat",
  SEARCH = "Search",
  ACTIVITY_LOG = "ActivityLog",
  INITIATIVE = "Initiative",
  BUSINESS_GROUP = "BusinessGroup",
}

export enum Permission {
  CAN = "can",
  CANNOT = "cannot",
}

export enum RoleId {
  INDIVIDUAL = 1,
  CORPORATE = 2,
  PBC_STAFF = 3,
  ADMIN = 4,
  CHAIRMAN = 5,
  GENERAL_SECRETARY = 6,
  VC_FINANCE = 7,
  DIRECTOR = 8,
  JOB_APPLICANT = 9,
}

export enum RoleIdStr {
  INDIVIDUAL = "1",
  CORPORATE = "2",
  PBC_STAFF = "3",
  ADMIN = "4",
  CHAIRMAN = "5",
  GENERAL_SECRETARY = "6",
  VC_FINANCE = "7",
  DIRECTOR = "8",
  JOB_APPLICANT = "9",
}

export enum Interaction {
  CLICK = "CLICK",
  COPY = "COPY",
}

export enum InteractionType {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

export enum UserNotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}

export enum AgreeOrNot {
  YES = "YES",
  NO = "NO",
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
}

export enum JobMode {
  REMOTE = "REMOTE",
  ONSITE = "ONSITE",
  HYBRID = "HYBRID",
}

export enum CallType {
  AUDIO = "audio",
  VIDEO = "video",
}

export enum CallNotificationType {
  INCOMING_CALL = "incoming_call",
}

export enum DateType {
  PAST = "past",
  FUTURE = "future",
  START = "start",
  END = "end",
}
