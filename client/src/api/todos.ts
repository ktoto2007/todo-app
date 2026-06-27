import axios from "axios";

const API_URL = "http://localhost:5000";

export const getTodos = async () => {
  const res = await axios.get(`${API_URL}/todos`);
  return res.data;
};

export const createTodo = async (title: string, folder_id: number, deadline: string | null) => {
  const res = await axios.post(
    `${API_URL}/todos`, {title, folder_id, deadline}
  );
  return res.data;
};

export const deleteTodo = async (id: number) => {
  const res = await axios.delete(`${API_URL}/todos/${id}`);
  return res.data;
};

export const getTodosByFolder = async (folderId: number) => {
  const res = await axios.get(
    `${API_URL}/todos/folder/${folderId}`
  );
  return res.data;
};

export const updateTodo = async (id: number, data: Partial<{ title: string; completed: boolean; important: boolean; deadline: string | null; folder_id: number; }>) => {
  const res = await axios.patch(
    `${API_URL}/todos/${id}`,
    data
  );
  return res.data;
};