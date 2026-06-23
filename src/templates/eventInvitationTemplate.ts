export const eventInvitationEmailTemplate = (
  userName: string,
  title: string,
  details: string,
  startDate: Date,
  endDate: Date,
  assignerName: string,
) => {
  const startDateTime = startDate.toLocaleString();
  const endDateTime = endDate.toLocaleString();

  return `
    <p>Dear <strong>${userName}</strong>,</p>
    <p>${assignerName} is pleased to invite you to the <strong>${title}</strong> event.</p>
    <p><strong>Event Details:</strong></p>
    <p>${details}</p>
    <br />
    <p><strong>Event Start Date and Time:</strong> ${startDateTime.split(",").join(" at ")} UTC</p>
    <p><strong>Event End Date and Time:</strong> ${endDateTime.split(",").join(" at ")} UTC</p>
    <br />
    <p>We look forward to your participation in this event and appreciate your involvement.</p>
    <br />
    <p>Best Regards,<br />Event Management Team.</p>
  `;
};

export const eventInvitationNotificationTemplate = (
  title: string,
  assignerName: string,
  startDate: Date,
) => {
  const startDateTime = startDate.toLocaleString();

  return `${assignerName} invited you to ${title} on ${startDateTime.split(",").join(" at ")}. Please refer to email for further details.`;
};
