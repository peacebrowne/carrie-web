import dayjs from "dayjs";
import { getImage } from "./service";

export const handleDateFormat = (date, format = "MMM DD, YYYY HH:mm A") =>
  dayjs(date).format(format);

export const attachArticleImage = async (articles) => {
  try {
    if (!articles.length) {
      const image = await handleImage(articles.id);
      return { ...articles, image };
    }

    return await Promise.all(
      articles.map(async (article) => {
        const image = await handleImage(article.id);
        return { ...article, image };
      })
    );
  } catch (error) {
    console.error("Error handling article images:", error);
    return articles;
  }
};

export const handleImage = async (id) => {
  if (id) {
    const { data, ok } = await getImage(id);
    if (ok && data.size) {
      return URL.createObjectURL(data);
    }
  }
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const truncateText = (text, maxLength = 50) => {
  if (!text) {
    return text;
  }

  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const describeNumberScale = (number) => {
  // Handle non-numbers or null/undefined
  if (typeof number !== "number" || !isFinite(number)) return String(number);

  const abs = Math.abs(number);

  if (abs < 1e3) return number.toString(); // < 1 000 → no suffix (e.g. 999)
  if (abs < 1e6) return format(number, 1e3, "K"); // thousands
  if (abs < 1e9) return format(number, 1e6, "M"); // millions
  if (abs < 1e12) return format(number, 1e9, "B"); // billions
  return format(number, 1e12, "T"); // trillions and above
};

function format(number, divisor, suffix) {
  const scaled = number / divisor;

  // Use 1 decimal place if it adds information, otherwise none
  const rounded =
    scaled >= 100
      ? Math.round(scaled) // 127 → 127M
      : Number(scaled.toFixed(1)); // 12.7 → 12.7M, 12.0 → 12M

  return rounded + suffix;
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};
