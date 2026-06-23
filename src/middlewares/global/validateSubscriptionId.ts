import { param } from "express-validator";

export const validateSubscriptionId = [
  param("subscriptionId")
    .notEmpty()
    .withMessage("Subscription ID is required")
    .matches(/^FLSSUB_[a-zA-Z0-9]+$/)
    .withMessage(
      "The provided subscription ID is invalid. It must start with 'FLSSUB_' followed by alphanumeric characters.",
    ),
];
