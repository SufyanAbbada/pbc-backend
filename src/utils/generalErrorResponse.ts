import { S3ServiceException } from "@aws-sdk/client-s3";
import { Response } from "express";

const generalErrorResponse = (error: any, res: Response): void => {
  if (
    error instanceof S3ServiceException ||
    error?.stack?.includes("@aws-sdk")
  ) {
    console.error("\nAmazon S3 Error:", error);
    res.status(400).json({
      error: [
        {
          path: "Amazon S3 Bucket -  Third Party Error",
          msg: "An error occurred while interacting with Amazon S3. Please try again later.",
        },
      ],
    });
    return;
  } else if (error.stack.includes("Zoho")) {
    console.error("\Zoho Books Error:", error);
    res.status(400).json({
      error: [
        {
          path: "Zoho Books -  Third Party Error",
          msg: "An error occurred while interacting with Zoho services. Please contact Dev team and check usage limits.",
        },
      ],
    });
    return;
  } else if (error.stack?.includes("twilio")) {
    if (error.code > 60000 && error.code < 61000) {
      const userFriendlyError = error.stack.slice(7).split(" at ")[0];
      res.status(400).json({
        error: [
          {
            path: "Twilio - Third Party Error",
            msg: userFriendlyError,
          },
        ],
      });
    } else
      res.status(400).json({
        error: [
          {
            path: "Twilio - Third Party",
            msg: "An error occurred while interacting with Twilio services. Please check credentials or usage limits.",
          },
        ],
      });
    return;
  } else {
    console.error("\nDatabase Error:", error);
    res.status(400).json({
      error: [
        {
          path: "Database Connection",
          msg: "Something went wrong due to a server issue. Please try again later",
        },
      ],
    });
    return;
  }
};

export default generalErrorResponse;
