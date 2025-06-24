/**
 * Format currency amount with proper currency symbol and locale
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage with proper decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export function formatCompactNumber(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay: "short",
  }).format(amount);
}

/**
 * Format date in a readable format
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", options);
}

/**
 * Format date range
 */
export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date
): string {
  const start = formatDate(startDate, { month: "short", day: "numeric" });
  const end = formatDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} - ${end}`;
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) < 1) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays === -1) {
    return "Yesterday";
  } else if (diffDays > 1) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
}

/**
 * Format budget period display name
 */
export function formatBudgetPeriod(
  period: "weekly" | "monthly" | "quarterly" | "yearly" | "custom",
  startDate?: string,
  endDate?: string
): string {
  if (period === "custom" && startDate && endDate) {
    return formatDateRange(startDate, endDate);
  }

  return period.charAt(0).toUpperCase() + period.slice(1);
}
