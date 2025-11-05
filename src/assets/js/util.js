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

export const useDebounceFn = (fn, delay = 300) => {
  let timer;

  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
};
