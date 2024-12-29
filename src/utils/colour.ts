export const getColorClassFromRange = (
    value: number,
    min: number,
    max: number,
    invert: boolean = false,
): string => {
    const normalizedValue = invert
        ? 1 - Math.min(1, Math.max(0, (value - min) / (max - min)))
        : Math.min(1, Math.max(0, (value - min) / (max - min)));

    if (normalizedValue > 0.9) return '!text-green-800';
    if (normalizedValue > 0.8) return '!text-green-700';
    if (normalizedValue > 0.7) return '!text-green-600';
    if (normalizedValue > 0.6) return '!text-green-500';
    if (normalizedValue > 0.5) return '!text-yellow-500';
    if (normalizedValue > 0.4) return '!text-orange-500';
    if (normalizedValue > 0.3) return '!text-red-500';
    if (normalizedValue > 0.2) return '!text-red-600';
    return '!text-red-700';
};
