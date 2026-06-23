import UserRepository from "../repositories/UserRepository";
import { sendEmail } from "../services/twilioService";
import { eventAttendingAppreciationEmailTemplate } from "../templates/eventAttendingAppreciationTemplate";

const sendEventAttendingAppreciationEmail = async (
  userIds: number[],
  title: string,
  startDate: Date,
) => {
  for (const userId of userIds) {
    const user = await UserRepository.getUserById(userId);
    if (user) {
      const emailContent = eventAttendingAppreciationEmailTemplate(
        user.name,
        title,
        startDate,
      );

      await sendEmail(
        user.email,
        `Thanks for Attending ${title}`,
        emailContent,
      );
    }
  }
};

export default sendEventAttendingAppreciationEmail;
