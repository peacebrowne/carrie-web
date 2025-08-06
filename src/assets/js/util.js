import dayjs from "dayjs";
import { getImage } from "./service";

export const handleDateFormat = (date, format = "MMM DD, YYYY") =>
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
