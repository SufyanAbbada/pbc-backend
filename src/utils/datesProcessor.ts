const formatNotificationPeriod = (days: number) => {
  switch (days) {
    case 30:
      return "1 month";
    case 10:
      return "10 days";
    case 1:
      return "1 day";
    default:
      return `${days} days`;
  }
};

function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function toFormattedTime(time: Date, timeZone: string = "Asia/Dubai"): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
  };
  return time.toLocaleString("en-US", options);
}

export { formatNotificationPeriod, addDaysToDate, isSameDay, toFormattedTime };
