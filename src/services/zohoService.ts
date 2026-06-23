import axios from "axios";
import zohoClient from "../config/zohoClient";
import { ZohoExpenseAccount } from "../common/types";

class ZohoExpenseService {
  private accessToken: string = "";

  private async authenticate(): Promise<void> {
    const params = new URLSearchParams({
      refresh_token: zohoClient.refreshToken,
      client_id: zohoClient.clientId,
      client_secret: zohoClient.clientSecret,
      grant_type: "refresh_token",
    });

    const response = await axios.post(zohoClient.tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    this.accessToken = response.data.access_token;
  }

  private async getExpenseAccountId(): Promise<string> {
    const response = await axios.get(
      `${zohoClient.booksApiBaseUrl}/chartofaccounts?organization_id=${zohoClient.orgId}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const accounts = response.data.chartofaccounts;
    const expenseAccounts = accounts.filter(
      (a: ZohoExpenseAccount) => a.account_type === "expense",
    );

    const preferred = expenseAccounts.find((a: ZohoExpenseAccount) =>
      ["general", "office", "miscellaneous", "other"].some((k: string) =>
        a.account_name.toLowerCase().includes(k),
      ),
    );

    if (preferred) return preferred.account_id;
    if (expenseAccounts.length) return expenseAccounts[0].account_id;

    const fallback = accounts.find(
      (a: ZohoExpenseAccount) => a.account_type === "other_current_asset",
    );
    if (fallback) return fallback.account_id;

    throw new Error("No suitable account found.");
  }

  async addExpense(expenseData: {
    date: string;
    amount: number;
    description: string;
    user_name: string;
    employee_id: string;
    account_id?: string;
    reference_number?: string;
  }) {
    try {
      await this.authenticate();

      const accountId =
        expenseData.account_id || (await this.getExpenseAccountId());

      const payload = {
        account_id: accountId,
        date: expenseData.date,
        amount: expenseData.amount,
        description: expenseData.description,
        reference_number: expenseData.reference_number || `EXP-${Date.now()}`,
        user_name: expenseData.user_name,
      };

      const response = await axios.post(
        `${zohoClient.booksApiBaseUrl}/expenses?organization_id=${zohoClient.orgId}`,
        payload,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.expense;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new ZohoExpenseService();
