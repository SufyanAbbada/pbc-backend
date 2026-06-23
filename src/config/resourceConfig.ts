import TransactionRepository from "../repositories/TransactionRepository";
import ProductRepository from "../repositories/ProductRepository";
import OrderRepository from "../repositories/orderRepository";
import AddressRepository from "../repositories/addressRepository";
import WishlistRepository from "../repositories/wishlistRepository";
import MembershipRepository from "../repositories/membershipRepository";
import LeadRepository from "../repositories/leadRepository";
import JobPostRepository from "../repositories/JobPostRepository";
import DiscountRepository from "../repositories/DiscountRepository";
import QuoteRepository from "../repositories/quoteRepository";
import RFQRepository from "../repositories/RfqRepository";
import CartRepository from "../repositories/cartRepository";
import TicketRepository from "../repositories/ticketRepository";
import TicketResponseRepository from "../repositories/ResponseRepository";
import PolicyRepository from "../repositories/policyRepository";
import TaskRepository from "../repositories/TaskRepository";
import initiativeRepository from "../repositories/initiativeRepository";
import { RoleId, Subject } from "../common/enums";

export interface ResourceConfig {
  idField: string;
  queryFunction: (id: number, userId: number) => Promise<boolean>;
}

const resourceConfig: Partial<Record<Subject, ResourceConfig>> = {
  Transaction: {
    idField: "transactionId",
    queryFunction: TransactionRepository.getTransactionByIdAndUserId,
  },
  Product: {
    idField: "productId",
    queryFunction: ProductRepository.getProductByIdAndUserId,
  },
  Order: {
    idField: "orderId",
    queryFunction: OrderRepository.getOrderByIdAndUserId,
  },
  Address: {
    idField: "addressId",
    queryFunction: AddressRepository.getAddressByAddressIdAndUserId,
  },
  Wishlist: {
    idField: "wishlistId",
    queryFunction: WishlistRepository.getWishlistByIdAndUserId,
  },
  Membership: {
    idField: "membershipId",
    queryFunction: MembershipRepository.getMembershipByIdAndUserId,
  },
  Lead: {
    idField: "leadId",
    queryFunction: LeadRepository.getLeadByIdAndUserId,
  },
  JobPost: {
    idField: "jobPostId",
    queryFunction: JobPostRepository.getJobPostByIdAndUserId,
  },
  Discount: {
    idField: "discountId",
    queryFunction: DiscountRepository.getDiscountByIdAndUserId,
  },
  Quote: {
    idField: "quoteId",
    queryFunction: QuoteRepository.getQuoteByIdAndUserId,
  },
  RFQ: {
    idField: "rfqId",
    queryFunction: RFQRepository.getRfqByIdAndUserId,
  },
  Cart: {
    idField: "cartId",
    queryFunction: CartRepository.getCartByIdAndUserId,
  },
  Ticket: {
    idField: "ticketId",
    queryFunction: TicketRepository.getTicketByIdAndUserId,
  },
  TicketResponse: {
    idField: "ticketResponseId",
    queryFunction: TicketResponseRepository.getResponseByIdAndUserId,
  },
  Policy: {
    idField: "policyId",
    queryFunction: PolicyRepository.getPolicyByIdAndUserId,
  },
  Task: {
    idField: "taskId",
    queryFunction: TaskRepository.getTaskByIdAndUserId,
  },
  Initiative: {
    idField: "initiativeId",
    queryFunction: initiativeRepository.getInitiativeByIdAndUserId,
  },
};

export const adminPermittedMutations: Partial<Record<Subject, RoleId[]>> = {
  Election: [RoleId.INDIVIDUAL, RoleId.CORPORATE, RoleId.JOB_APPLICANT],
  Category: [RoleId.INDIVIDUAL, RoleId.CORPORATE, RoleId.JOB_APPLICANT],
  TicketCategory: [RoleId.INDIVIDUAL, RoleId.CORPORATE, RoleId.JOB_APPLICANT],
  JobCategory: [RoleId.INDIVIDUAL, RoleId.CORPORATE, RoleId.JOB_APPLICANT],
  JobSkill: [RoleId.INDIVIDUAL, RoleId.CORPORATE, RoleId.JOB_APPLICANT],
  Event: [RoleId.INDIVIDUAL, RoleId.CORPORATE, RoleId.JOB_APPLICANT],
  TransactionCategory: [
    RoleId.INDIVIDUAL,
    RoleId.CORPORATE,
    RoleId.JOB_APPLICANT,
  ],
};

export default resourceConfig;
