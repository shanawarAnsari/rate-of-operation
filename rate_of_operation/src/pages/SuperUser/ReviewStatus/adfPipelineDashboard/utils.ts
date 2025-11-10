export function convertToLocalDateTime(utcDateTime: string): string {
  if (!utcDateTime) return "";

  const utcDate = new Date(utcDateTime);
  const localDate = new Date(utcDate.getTime());

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return localDate.toLocaleString(undefined, options);
}


export function convertToMinSeconds(durationInMs?: number): string {
  if (!durationInMs || durationInMs < 0) return "-";

  const totalSeconds = Math.floor(durationInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minLabel = "m";
  const secLabel = "s";

  if (minutes > 0 && seconds > 0) {
    return `${minutes} ${minLabel}  ${seconds} ${secLabel}`;
  } else if (minutes > 0) {
    return `${minutes} ${minLabel}`;
  } else {
    return `${seconds} ${secLabel}`;
  }
}
