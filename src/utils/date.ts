export const formatCompletedTime = (date: number) => {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (date: number) => {
  return new Date(date).toLocaleDateString();
};