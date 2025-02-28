import dayjs from "dayjs";

export const handleDateFormat = (date, format = "MMM DD, YYYY") => dayjs(date).format(format);
