import LeadRepository from "../../repositories/leadRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateProductDependency = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const productId =
      source === SourceType.BODY ? req.body.productId : req.params.productId;

    const leads = await LeadRepository.getLeadsByProductId(Number(productId));

    if (leads.length > 0) {
      res.status(403).json({
        error: [
          {
            path: "productId",
            msg: "You cannot delete this product as it is already brought by some users.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateProductDependency;
