import sgMail from "@sendgrid/mail";
import AccessToken from "twilio/lib/jwt/AccessToken";
import twilioVerifyClient from "../config/twilioClient";
import { ChatGrant } from "twilio/lib/jwt/AccessToken";
import { VideoGrant } from "twilio/lib/jwt/AccessToken";
import { Response } from "express";

sgMail.setApiKey(process.env.TWILIO_SENDGRID_API_KEY!);

export const sendOtp = async (method: string, recipient: string) => {
  try {
    const otpSendStatus = await twilioVerifyClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: recipient,
        channel: method,
      });
    return otpSendStatus;
  } catch (err: any) {
    throw err;
  }
};

export const verifyOTP = async (method: string, otp: string, res: Response) => {
  try {
    const otpVerifyStatus = await twilioVerifyClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: method,
        code: otp,
      });

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
    throw err;
  }
};

export const generateAccessTokenForChat = (identity: string): string => {
  try {
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY_SID!,
      process.env.TWILIO_API_KEY_SECRET!,
      { identity, ttl: 86400 },
    );

    const chatGrant = new ChatGrant({
      serviceSid: process.env.TWILIO_CONVERSATION_SERVICE_SID!,
    });

    token.addGrant(chatGrant);

    return token.toJwt();
  } catch (err: any) {
    throw err;
  }
};

export const generateAccessTokenForCall = (
  identity: string,
  room: string,
): string => {
  try {
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY_SID!,
      process.env.TWILIO_API_KEY_SECRET!,
      { identity, ttl: 86400 },
    );

    const videoGrant = new VideoGrant({ room });
    token.addGrant(videoGrant);

    return token.toJwt();
  } catch (err: any) {
    throw err;
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const emailContent = {
      to,
      from: process.env.TWILIO_SENDGRID_VERIFIED_SENDER!,
      subject,
      html,
    };

    return await sgMail.send(emailContent);
  } catch (error) {
    throw new Error("Failed to send email. Please try again later.");
  }
};
