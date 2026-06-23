import { RequestHandler } from "express";
import { body, param } from "express-validator";
import { SourceType } from "../../common/enums";

const FIELD_FREQUENCIES = {
  title: { min: 5, max: 200 },
  description: { min: 5, max: 50000 },
  notes: { min: 5, max: 10000 },
  name: { min: 3, max: 50 },
  applicantName: { min: 3, max: 150 },
  address: { min: 5, max: 250 },
  discountCode: { min: 4, max: 20 },
  companyName: { min: 2, max: 150 },
  industry: { min: 2, max: 150 },
  comment: { min: 5, max: 5000 },
  categoryName: { min: 1, max: 200 },
  fullName: { min: 2, max: 50 },
  city: { min: 2, max: 50 },
  country: { min: 2, max: 56 },
  affiliation: { min: 2, max: 1000 },
  legalStatus: { min: 2, max: 150 },
  natureOfBusiness: { min: 2, max: 1000 },
  businessGroup: { min: 2, max: 150 },
  emiratesIssuingAuthority: { min: 2, max: 255 },
  keywords: { min: 1, max: 200 },
  hsCodes: { min: 1, max: 200 },
  shareHolderStatus: { min: 3, max: 100 },
  otherShareHoldersName: { min: 2, max: 200 },
  annualRevenue: { min: 1, max: 50 },
  expectations: { min: 10, max: 1000 },
  selfDescription: { min: 10, max: 1000 },
  councilDiscoveryMethod: { min: 5, max: 200 },
  membershipCategory: { min: 3, max: 100 },
  references: { min: 3, max: 200 },
  professionalTitle: { min: 2, max: 100 },
  languagesSpoken: { min: 2, max: 150 },
  primeClients: { min: 3, max: 200 },
  addressLine1: { min: 2, max: 1000 },
  subscriptionId: { min: 23, max: 23 },
  suggestions: { min: 5, max: 15000 },
  ticketDescription: { min: 10, max: 10000 },
  response: { min: 5, max: 2000 },
  content: { min: 10, max: 50000 },
  reason: { min: 10, max: 1000 },
  details: { min: 5, max: 10000 },
  eventMOM: { min: 5, max: 50000 },
  tasks: { min: 5, max: 1000 },
  location: { min: 5, max: 500 },
  token: { min: 40, max: 55 },
  venue: { min: 5, max: 500 },
  room: { min: 1, max: 250 },
  callFrom: { min: 3, max: 150 },
  roomName: { min: 30, max: 40 },
};

const validateTitles = (
  fieldName: keyof typeof FIELD_FREQUENCIES,
  source: SourceType = SourceType.BODY,
): RequestHandler[] => {
  const validator =
    source === SourceType.BODY ? body(fieldName) : param(fieldName);
  const { min, max } = FIELD_FREQUENCIES[fieldName] || { min: 5, max: 5000 };

  return [
    validator
      .trim()
      .notEmpty()
      .withMessage(`'${fieldName}' is required`)
      .isString()
      .withMessage(`'${fieldName}' must be a string`)
      .isLength({ min, max })
      .withMessage(
        `The provided '${fieldName}' length must be at least ${min} characters long and should not exceed ${max} characters`,
      )
      .matches(/^(?!\d+$).+/)
      .withMessage(`The provided '${fieldName}' cannot be only numbers.`),
  ];
};

export default validateTitles;
