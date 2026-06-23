import ConstitutionRepository from "../../repositories/ConstitutionRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { DEFAULT_VERSION } from "../../common/constants";
import { PolicyVersion } from "../../common/enums";

const parseVersion: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const latestVersionData = await ConstitutionRepository.getLatestVersion();

    let latestVersion =
      latestVersionData?.version || DEFAULT_VERSION.FILE_VERSION;

    let [major, minor, patch] = latestVersion.split(".").map(Number);

    const { version } = req.body;
    if (version === PolicyVersion.MAJOR) {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (version === PolicyVersion.MINOR) {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }

    req.body.version = `${major}.${minor}.${patch}`;

    next();
  } catch (error: any) {
    generalErrorResponse(error, res);
    return;
  }
};

export default parseVersion;
