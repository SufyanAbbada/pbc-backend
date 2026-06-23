export const accountDeletionEmailTemplate = (
  userName: string,
  deletionLink: string,
) => {
  return `
    <p>Dear <strong>${userName}</strong>,</p>
    <p>We have received a request to delete your account from our platform.</p>
    <p>If you did not make this request, please ignore this email and your account will remain active.</p>
    <br />
    <p>To confirm your account deletion, please click on the link below:</p>
    <p><a href="${deletionLink}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Confirm Account Deletion</a></p>
    <br />
    <p>Please note that this action is permanent and cannot be undone. All your data will be permanently removed from our system.</p>
    <p>This link will expire in 24 hours for security purposes.</p>
    <br />
    <p>If you have any questions or need assistance, please contact our support team.</p>
    <br />
    <p>Best Regards,<br />PBC</p>
  `;
};
