const { VITE_API_URL: API_URL } = import.meta.env;
import axios from "axios";

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
    const {
      term = "",
      start = 0,
      limit = 10,
      sort = "",
      published = "",
    } = params;

    let url = `${API_URL}/articles/authors/${id}`;

    if (term) {
      url += `/search?term=${term}`;
    }

    url += `?start=${start}&limit=${limit}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    if (["", null, undefined].indexOf(published)) {
      url += `&published=${published}`;
    }

    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching author's articles", error);
  }
};
