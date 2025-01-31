const { VITE_API_URL: API_URL } = import.meta.env;

export const addArticle = async (data) => {
  try {
    const options = {
      method: "POST",
      body: data,
    };
    const response = await fetch(`${API_URL}/articles`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding article:", error);
  }
};

export const getAuthorArticles = async (id, params = {}) => {
  try {
    const url = new URL(`${API_URL}/articles/authors/${id}`);
    if (params.term) url.pathname += "/search";

    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching author's articles", error);
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/articles/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching a single article");
  }
};

export const getImage = async (id) => {
  try {
    const response = await fetch(`${API_URL}/images/${id}`);
    const data = await response.blob();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error fetching image", error);
  }
};

export const getComments = async (id) => {
  try {
    const response = await fetch(`${API_URL}/comments/articles/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching an article comments", error);
  }
};

export const getAuthorById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/authors/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching author data");
  }
};

export const addClaps = async (data) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(`${API_URL}/claps`,options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding clap:", error);
  }
};
