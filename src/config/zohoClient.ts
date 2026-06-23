class ZohoExpenseClient {
  readonly orgId: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly refreshToken: string;
  readonly tokenUrl: string;
  readonly booksApiBaseUrl: string;

  constructor() {
    this.orgId = process.env.ZOHO_ORG_ID!;
    this.clientId = process.env.ZOHO_CLIENT_ID!;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET!;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN!;
    this.tokenUrl = process.env.ZOHO_TOKEN_URL!;
    this.booksApiBaseUrl = process.env.ZOHO_BOOKS_API_URL!;
  }
}

export default new ZohoExpenseClient();
