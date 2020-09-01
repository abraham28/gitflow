import moment from "moment-timezone";

export const formatDate = (dateStr) => {
  return moment(dateStr).format("MM-DD-YYYY HH:mm:ss \\[UTCZ\\]");
};
