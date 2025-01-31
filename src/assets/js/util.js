import dayjs from "dayjs";

export const handleDateFormat = (date) => dayjs(date).format("MMM DD, YYYY");
