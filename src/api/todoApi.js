import axios from "axios";




const api= axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;


// export const getAllTodos = () => axios.get(BASE_URL);

// export const createTodo = (todo) => axios.post(BASE_URL, todo);

// export const deleteTodo = (title) =>
//   axios.delete(`${BASE_URL}/deleteBytitle?str=${encodeURIComponent(title)}`);

// export const searchTodo = (keyword) =>
//   axios.get(`${BASE_URL}/search?str=${encodeURIComponent(keyword)}`);

// export const getByStatus = (status) =>
//   axios.get(`${BASE_URL}/${status}`);


