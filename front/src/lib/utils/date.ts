// TODO: DONE
export const formatDate = (
  date: Date | string,
  locale: string = "fr-FR"
): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatTimeOnly = (
  date: Date | string,
  locale: string = "fr-FR"
): string => {
  const d = new Date(date);
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const addTime = (
  date: Date,
  hours = 0,
  minutes = 0,
  seconds = 0
): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  result.setMinutes(result.getMinutes() + minutes);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

export const getTimeFromDate = (
  date: Date | string
): {
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const d = new Date(date);
  return {
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
  };
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
