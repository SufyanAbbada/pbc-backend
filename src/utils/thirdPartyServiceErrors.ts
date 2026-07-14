export class ThirdPartyServiceDisabledError extends Error {
  constructor(
    public readonly serviceName: string,
    public readonly featureName: string,
  ) {
    super(`${serviceName} is disabled or missing configuration.`);
    this.name = "ThirdPartyServiceDisabledError";
  }
}
