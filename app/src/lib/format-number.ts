export const formatCompactNumber = (value: number): string => {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
};

export const formatScoreLabel = (score: number): string => {
    return `${formatCompactNumber(score)} point${Math.abs(score) === 1 ? "" : "s"}`;
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
};

export const formatPercent = (value: number, fractionDigits = 0): string => {
    return `${value.toFixed(fractionDigits)}%`;
};
