interface ExpiryEmailTemplate {
  userName: string;
  period: string;
  expiryDate: Date;
  attribute: string;
}

interface ExpiryNotificationTemplate {
  period: string;
  expiryDate: Date;
  attribute: string;
}

export function documentsExpiryEmailTemplate({
  userName,
  period,
  expiryDate,
  attribute,
}: ExpiryEmailTemplate): string {
  return `
    <p>Dear ${userName},</p>
    <p>Your ${attribute} is set to expire in <strong>${period}</strong> on <strong>${expiryDate.toDateString()}</strong>.</p>
    <p>Please take the necessary action to renew it to avoid any interruptions in your membership.</p>
    <br />
    <p>Regards,<br />Membership Support Team</p>
  `;
}

export function documentsExpiryPushNotificationTemplate({
  period,
  expiryDate,
  attribute,
}: ExpiryNotificationTemplate): string {
  return `${attribute} is expiring in ${period} on ${expiryDate.toDateString()}`;
}
