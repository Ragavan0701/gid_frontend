import axios from "axios";

const BASE_URL = "http://localhost:8080/api/todo";

export const getAllTodos = () => axios.get(BASE_URL);

export const createTodo = (todo) => axios.post(BASE_URL, todo);

export const deleteTodo = (title) =>
  axios.delete(`${BASE_URL}/deleteBytitle?str=${encodeURIComponent(title)}`);

export const searchTodo = (keyword) =>
  axios.get(`${BASE_URL}/search?str=${encodeURIComponent(keyword)}`);

export const getByStatus = (status) =>
  axios.get(`${BASE_URL}/${status}`);


