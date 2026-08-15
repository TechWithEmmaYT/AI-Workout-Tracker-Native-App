import { format } from "date-fns";

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
};

// timestamp like "Thu, Aug 6, 8:45 AM" for the history screens.
export const formatSessionDate = (date: string) =>
  format(new Date(date), "EEE, MMM d, h:mm a");
