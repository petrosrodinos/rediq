import { formatDistanceToNowStrict, format } from "date-fns";

export const formatRelativeTime = (value: string | Date): string => {
    return `${formatDistanceToNowStrict(new Date(value))} ago`;
};

export const formatDate = (value: string | Date): string => {
    return format(new Date(value), "MMM d, yyyy");
};

export const formatDateTime = (value: string | Date): string => {
    return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
};

export const formatClock = (value: string | Date): string => {
    return format(new Date(value), "HH:mm:ss");
};
