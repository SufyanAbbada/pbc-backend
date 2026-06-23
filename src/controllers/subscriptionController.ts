import membershipRepository from "../repositories/membershipRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import {
  GetSubscriptionResponse,
  CreateSubscriptionResponse,
} from "../common/types";
import { extractPhoneCodeAndNumber } from "../utils/extractPhoneAndCountryCode";
import { Request, Response } from "express";

class MembershipApprovalController {
  async createSubscription(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const { countryCode, phoneNumber } = extractPhoneCodeAndNumber(
        user.phoneNumber,
      );

      const data = {
        plan_name: "Member plan",
        billing_type: "year",
        billing_cycle: 1,
        billing_currency: "AED",
        billing_amount: "1",
        total_count: 1,
        description: "Yearly demo plan",
        notify_email: "Yes",
        notify_sms: "No",
        customer: {
          user: user.name,
          email: user.email,
          phone_code: countryCode,
          phone_number: phoneNumber,
        },
      };

      const response = await fetch(
        "https://api.foloosi.com/v1/subscription/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            secret_key: process.env.FOLOOSI_SECRET_KEY!,
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "SubscriptionController: Failed to create subscription with Foloosi. Response status:",
          response.status,
        );
      } else {
        const typedResult = result as CreateSubscriptionResponse;
        const subscriptionId = typedResult.data?.subscription_no;

        await membershipRepository.createSubscriptionId(
          user.id,
          subscriptionId || "",
        );
      }
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getSubscriptionBySubscriptionId(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;

      const url = `https://api.foloosi.com/v1/open/subscription-link/detail/${subscriptionId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          secret_key: process.env.FOLOOSI_SECRET_KEY!,
        },
      });

      if (!response.ok) {
        console.error(
          "SubscriptionController: Failed to fetch subscription details from Foloosi. Status:",
          response.status,
        );
        return res.status(response.status).json({
          message: "Failed to fetch subscription details from Foloosi",
        });
      }

      const data = (await response.json()) as GetSubscriptionResponse;

      const cardLastFour = data?.data?.data?.customer?.card_last_four;
      const planStatus = data?.data?.data?.plan?.status;

      if (cardLastFour !== null && planStatus === "active") {
        await membershipRepository.updatePaymentStatus(subscriptionId, true);
      }

      return res.status(200).json({
        message: "Subscription details fetched successfully",
        data,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMySubscription(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const membership = await membershipRepository.getMembershipByUserId(
        Number(userId),
      );

      const url = `https://api.foloosi.com/v1/open/subscription-link/detail/${membership?.subscriptionId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          secret_key: process.env.FOLOOSI_SECRET_KEY!,
        },
      });

      if (!response.ok) {
        console.error(
          "SubscriptionController: Failed to fetch subscription details from Foloosi. Status:",
          response.status,
        );
        return res.status(response.status).json({
          message: "Failed to fetch subscription details from Foloosi",
        });
      }

      const data = (await response.json()) as GetSubscriptionResponse;

      const cardLastFour = data?.data?.data?.customer?.card_last_four;
      const planStatus = data?.data?.data?.plan?.status;

      if (
        membership?.subscriptionId &&
        cardLastFour !== null &&
        planStatus === "active"
      ) {
        await membershipRepository.updatePaymentStatus(
          membership?.subscriptionId,
          true,
        );
      }

      return res.status(200).json({
        message: "Subscription details fetched successfully",
        data,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new MembershipApprovalController();
