export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export const membershipRegistrationTemplate = (
  adminName: string,
  name: string,
  email: string,
  registrationDate: Date,
) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello ${adminName},</p>
      <p>A new user has registered for a membership. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Registration Date:</strong> ${formatDate(registrationDate)}</li>
      </ul>
      <p>Please review the registration and take any necessary follow-up actions.</p>
      <p>Best regards,<br/>PBC Team</p>
    </div>
  `;
};

export const membershipReviewTemplate = (
  adminName: string,
  name: string,
  email: string,
  status: string,
  comment: string,
  membershipId: string,
) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello ${adminName},</p>
      <p>A new membership decision has been submitted. Here are the details:</p>
      <ul>
        <li><strong>Name of reviewer:</strong> ${name}</li>
        <li><strong>Email of reviewer:</strong> ${email}</li>
        <li><strong>Membership ID:</strong> ${membershipId}</li>
        <li><strong>Status:</strong> ${status}</li>
        <li><strong>Comment:</strong> ${comment}</li>
      </ul>
      <p>Please review the vote and take any necessary follow-up actions.</p>
      <p>Best regards,<br/>PBC Team</p>
    </div>
  `;
};

export const membershipCompletedTemplate = (
  adminName: string,
  name: string,
  email: string,
) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello ${adminName},</p>
      <p>The membership process for the following user has been completed with the final review of the Chairman:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <p>Thank you for your attention.</p>
      <p>Best regards,<br/>PBC Team</p>
    </div>
  `;
};
