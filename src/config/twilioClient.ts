import { Twilio } from "twilio";

export const isTwilioVerifyEnabled = (): boolean =>
  process.env.TWILIO_ENABLED !== "false" &&
  Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_VERIFY_SERVICE_SID,
  );

const twilioVerifyClient = isTwilioVerifyEnabled()
  ? new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  : null;

export default twilioVerifyClient;
