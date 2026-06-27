import axios from "axios";

const API_URL = "http://localhost:5000";

export const getTodos = async () => {
  const res = await axios.get(`${API_URL}/todos`);
  return res.data;
};

export const createTodo = async (title: string) => {
  const res = await axios.post(`${API_URL}/todos`, { title });
  return res.data;
};

export const updateTodo = async (id: number, completed: boolean) => {
  const res = await axios.patch(`${API_URL}/todos/${id}`, {
    completed,
  });
  return res.data;
};

export const deleteTodo = async (id: number) => {
  const res = await axios.delete(`${API_URL}/todos/${id}`);
  return res.data;
};