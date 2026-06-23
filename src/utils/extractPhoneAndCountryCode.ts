import { PHONE_NUMBERS } from "../common/constants";

export function extractPhoneCodeAndNumber(fullPhoneNumber: string) {
  const sortedCountryCodes = PHONE_NUMBERS.COUNTRY_CODES.sort(
    (a, b) => b.length - a.length,
  );

  for (const code of sortedCountryCodes) {
    if (fullPhoneNumber.startsWith(code)) {
      return {
        countryCode: code,
        phoneNumber: fullPhoneNumber.slice(code.length),
      };
    }
  }

  return { countryCode: null, phoneNumber: fullPhoneNumber };
}
