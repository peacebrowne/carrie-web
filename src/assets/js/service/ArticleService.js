const { VITE_API_URL: API_URL } = import.meta.env;

export const addArticle = async (data) => {
  try {
    const options = {
      method: "POST",
      body: data,
    };
    const response = await fetch(`${API_URL}/articles`, options);
    const result = await response.json();
    const { ok } = response;
    return { ok, result };
  } catch (error) {
    console.error("Error adding article:", error);
  }
};

export const getAuthorArticles = async (id, params = {}) => {
  try {
    const url = new URL(`${API_URL}/articles/authors/${id}`);
    if (params.term) url.pathname += "/search";
    
    url.search = new URLSearchParams(params).toString();

    console.log({ url });

    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching author's articles", error);
  }
};

export const getImage = async (id) => {
  try {
    const response = await fetch(`${API_URL}/images/${id}`);
    const data = await response.blob();
    const { ok } = response;
    return { ok, data };
  } catch (error) {
    console.error("Error fetching image", error);
  }
};
