const { VITE_API_URL: API_URL } = import.meta.env;
import { cookiesStore } from "../../stores";

const token = () => {
  const { getCookie } = cookiesStore();
  return getCookie();
};

export const addArticle = async (data) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      body: data,
    };
    const response = await fetch(`${API_URL}/articles`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding article:", error);
  }
};

export const addImage = async (id, data, type) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      body: data,
    };

    const response = await fetch(
      `${API_URL}/images?id=${id}&type=${type}`,
      options
    );
    const result = await response.blob();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding image", error);
  }
};

export const editArticle = async (id, data) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      body: data,
    };
    const response = await fetch(`${API_URL}/articles/${id}`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding article:", error);
  }
};

export const getAuthorArticles = async (id, params = {}) => {
  try {
    const url = new URL(
      `${API_URL}/articles/authors/${id}${params?.term ? "/search" : ""}`
    );

    url.search = new URLSearchParams(params).toString();

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching author's articles", error);
  }
};

export const getArticleById = async (id) => {
  try {
    const { getCookie } = cookiesStore();

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    };
    const response = await fetch(`${API_URL}/articles/${id}`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching a single article");
  }
};

export const getImage = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };
    const response = await fetch(`${API_URL}/images/${id}`, options);
    const data = await response.blob();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error fetching image", error);
  }
};

export const getComments = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };
    const response = await fetch(`${API_URL}/comments/articles/${id}`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching an article comments", error);
  }
};

export const getAuthorById = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(`${API_URL}/authors/${id}`, options);
    return await response.json();
  } catch (error) {
    console.log({ error });
    console.error("Error fetching author data");
  }
};

export const addClaps = async (data) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(data),
    };

    // Added  the action=like because the dislike feature wil be later
    const response = await fetch(`${API_URL}/claps?action=like`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding clap: ", error);
  }
};

export const getCommentReplies = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };
    const response = await fetch(`${API_URL}/comments/replies/${id}`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching comment replies");
  }
};

export const addComment = async (data) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(`${API_URL}/comments`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

export const login = async (data) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(`${API_URL}/login`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error logging user in", error);
  }
};

export const register = async (data) => {
  try {
    const options = {
      method: "POST",
      body: data,
    };

    const response = await fetch(`${API_URL}/register`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error registering user", error);
  }
};

export const getArticleAnalytics = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(
      `${API_URL}/articles/${id}/article-analytics`,
      options
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching article analytics", error);
  }
};

export const getArticles = async (params = {}) => {
  try {
    const url = new URL(`${API_URL}/articles${params?.term ? "/search" : ""}`);
    url.search = new URLSearchParams(params).toString();

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching articles", error);
  }
};

export const getAuthorInterestedArticles = async (id, params = {}) => {
  try {
    const url = new URL(`${API_URL}/articles/author/${id}/interests`);
    url.search = new URLSearchParams(params).toString();

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching articles", error);
  }
};

export const getInterests = async () => {
  try {
    const options = {
      method: "GET",
    };

    const response = await fetch(`${API_URL}/tags`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching interests", error);
  }
};

export const followAuthor = async (follower, author) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(
      `${API_URL}/authors/follow?follower=${follower}&author=${author}`,
      options
    );
    return await response.json();
  } catch (error) {
    console.log("Error");
  }
};

export const unfollowAuthor = async (follower, author) => {
  try {
    console.log({ follower, author });

    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(
      `${API_URL}/authors/unfollow?follower=${follower}&author=${author}`,
      options
    );
    return await response.json();
  } catch (error) {
    console.log("Error");
  }
};

export const getFollowedAuthors = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(`${API_URL}/authors/${id}/followed`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching followed authors");
  }
};

export const getAuthorFollowers = async (id) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    };

    const response = await fetch(`${API_URL}/authors/${id}/followers`, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching followed authors");
  }
};

export const editAuthor = async (id, data) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(`${API_URL}/authors/${id}`, options);
    const result = await response.json();
    return { ok: response.ok, result };
  } catch (error) {
    console.error("Error editing author:", error);
  }
};
