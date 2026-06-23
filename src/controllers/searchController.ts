import RfqRepository from "../repositories/RfqRepository";
import WishlistRepository from "../repositories/wishlistRepository";
import ProductRepository from "../repositories/ProductRepository";
import JobPostRepository from "../repositories/JobPostRepository";
import LeadRepository from "../repositories/leadRepository";
import ProfileRepository from "../repositories/ProfileRepository";
import QuoteRepository from "../repositories/quoteRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import electionRepository from "../repositories/electionRepository";
import EventRepository from "../repositories/EventRepository";
import ticketRepository from "../repositories/ticketRepository";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class SearchController {
  async searchAll(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const [
        rfqResults,
        wishlistResults,
        productResults,
        jobPostResults,
        leadResults,
        profileResults,
        quoteResults,
        electionResults,
        eventResults,
        ticketResults,
      ] = await Promise.all([
        RfqRepository.searchRfqs(search as string, page, limit),
        WishlistRepository.searchWishlists(search as string, page, limit),
        ProductRepository.searchProducts(search as string, page, limit),
        JobPostRepository.searchJobPosts(search as string, page, limit),
        LeadRepository.searchLeads(search as string, page, limit),
        ProfileRepository.searchProfiles(search as string, page, limit),
        QuoteRepository.searchQuotes(search as string, page, limit),
        electionRepository.searchElections(search as string, page, limit),
        EventRepository.searchEvents(search as string, page, limit),
        ticketRepository.searchTickets(search as string, page, limit),
      ]);

      const totalCount =
        rfqResults.totalCount +
        wishlistResults.totalCount +
        productResults.totalCount +
        jobPostResults.totalCount +
        leadResults.totalCount +
        profileResults.totalCount +
        quoteResults.totalCount +
        electionResults.totalCount +
        eventResults.totalCount +
        ticketResults.totalCount;

      const response: PaginationResponse = {
        message: "Search results fetched successfully",
        data: {
          rfqs: rfqResults.rfqs || [],
          wishlists: wishlistResults.wishlists || [],
          products: productResults.products || [],
          jobPosts: jobPostResults.jobPosts || [],
          leads: leadResults.leads || [],
          profiles: profileResults.profiles || [],
          quotes: quoteResults.quotes || [],
          elections: electionResults.elections || [],
          events: eventResults.events || [],
          tickets: ticketResults.tickets || [],
          searchTerm: search,
          counts: {
            rfqs: rfqResults.totalCount,
            wishlists: wishlistResults.totalCount,
            products: productResults.totalCount,
            jobPosts: jobPostResults.totalCount,
            leads: leadResults.totalCount,
            profiles: profileResults.totalCount,
            quotes: quoteResults.totalCount,
            elections: electionResults.totalCount,
            events: eventResults.totalCount,
            tickets: ticketResults.totalCount,
          },
        },
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new SearchController();
