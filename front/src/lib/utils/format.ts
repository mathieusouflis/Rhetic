//TODO: DONE

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPrice = (
  price: number,
  locale: string = "fr-FR",
  currency: string = "EUR"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const formatNumber = (number: number): string => {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
};
