import sgMail from "@sendgrid/mail";
import twilioVerifyClient, {
  isTwilioVerifyEnabled,
} from "../config/twilioClient";
import { Response } from "express";
import { ThirdPartyServiceDisabledError } from "../utils/thirdPartyServiceErrors";

const maskRecipient = (recipient: string): string => {
  if (recipient.includes("@")) {
    const [name, domain] = recipient.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }

  return `${recipient.slice(0, 4)}***${recipient.slice(-2)}`;
};

const isSendGridEnabled = (): boolean =>
  process.env.SENDGRID_ENABLED !== "false" &&
  Boolean(
    process.env.TWILIO_SENDGRID_API_KEY &&
      process.env.TWILIO_SENDGRID_VERIFIED_SENDER,
  );

if (isSendGridEnabled()) {
  sgMail.setApiKey(process.env.TWILIO_SENDGRID_API_KEY!);
}

export const sendOtp = async (method: string, recipient: string) => {
  try {
    console.info(
      `[Twilio Verify] Sending ${method} OTP to ${maskRecipient(recipient)}`,
    );

    if (!isTwilioVerifyEnabled() || !twilioVerifyClient) {
      throw new ThirdPartyServiceDisabledError("Twilio Verify", "OTP delivery");
    }

    const otpSendStatus = await twilioVerifyClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: recipient,
        channel: method,
      });
    console.info(
      `[Twilio Verify] ${method} OTP request accepted. sid=${otpSendStatus.sid} status=${otpSendStatus.status}`,
    );
    return otpSendStatus;
  } catch (err: any) {
    console.error(
      `[Twilio Verify] Failed to send ${method} OTP to ${maskRecipient(recipient)}`,
      err,
    );
    throw err;
  }
};

export const verifyOTP = async (method: string, otp: string, res: Response) => {
  try {
    console.info(`[Twilio Verify] Verifying OTP for ${maskRecipient(method)}`);

    if (!isTwilioVerifyEnabled() || !twilioVerifyClient) {
      throw new ThirdPartyServiceDisabledError(
        "Twilio Verify",
        "OTP verification",
      );
    }

    const otpVerifyStatus = await twilioVerifyClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: method,
        code: otp,
      });

    console.info(
      `[Twilio Verify] OTP verification result for ${maskRecipient(method)}: ${otpVerifyStatus.status}`,
    );

    if (otpVerifyStatus?.status !== "approved") {
      return res.status(400).json({
        error: [
          {
            msg: `The ${method} OTP is either invalid or has expired. Please request a new one and try again`,
            path: otp,
          },
        ],
      });
    }

    return otpVerifyStatus;
  } catch (err: any) {
    console.error(
      `[Twilio Verify] Failed to verify OTP for ${maskRecipient(method)}`,
      err,
    );
    throw err;
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!isSendGridEnabled()) {
      console.warn(
        `[SendGrid disabled] Skipped email "${subject}" to ${maskRecipient(to)}. Add TWILIO_SENDGRID_API_KEY and TWILIO_SENDGRID_VERIFIED_SENDER, or set SENDGRID_ENABLED=true, to send email.`,
      );
      return null;
    }

    const emailContent = {
      to,
      from: process.env.TWILIO_SENDGRID_VERIFIED_SENDER!,
      subject,
      html,
    };

    console.info(
      `[SendGrid] Sending email "${subject}" to ${maskRecipient(to)}`,
    );
    const response = await sgMail.send(emailContent);
    console.info(`[SendGrid] Email "${subject}" accepted for delivery.`);
    return response;
  } catch (error) {
    console.error(
      `[SendGrid] Failed to send email "${subject}" to ${maskRecipient(to)}`,
      error,
    );
    throw new Error("Failed to send email. Please try again later.");
  }
};
