import dayjs from "dayjs";
import { getImage } from "./service";

export const handleDateFormat = (date, format = "MMM DD, YYYY") =>
  dayjs(date).format(format);

export const attachArticleImage = async (articleData) => {
  try {
    return await Promise.all(
      articleData.map(async (article) => {
        const { data, ok } = await getImage(article.id);
        let image;
        if (ok && data.size) {
          image = URL.createObjectURL(data);
        }
        return { ...article, image };
      })
    );
  } catch (error) {
    console.error("Error handling article images:", error);
    return articleData;
  }
};


export const fetchUserImage = async (id) => {
  if (id) {
    const { data, ok } = await getImage(id);

    if (ok && data.size) {
      return URL.createObjectURL(data);
    }
  }
};

