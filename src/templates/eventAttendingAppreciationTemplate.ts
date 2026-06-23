export const eventAttendingAppreciationEmailTemplate = (
  userName: string,
  eventTitle: string,
  eventDate: Date,
) => {
  return `
    <p>Dear ${userName},</p>
    <p>Thank you for your participation in the <strong>${eventTitle}</strong> event, which took place on <strong>${eventDate.toDateString()}</strong>.</p>
    <p>We truly appreciate your engagement and the time you dedicated to making the event a success.</p>
    <br />
    <p>Please note, The media related to the event, including images and videos, will be available on the PBC website once uploaded by the event organizers.</p>
    <br />
    <p>Thank you once again, and we look forward to your continued participation in future events.</p>
    <br />
    <p>Best regards,<br />Event Management Team</p>
  `;
};
