import axios from "axios";

const API = "http://localhost:5000";

export const getFolders = async () => {
  const res = await axios.get(`${API}/folders`);
  return res.data;
};

export const createFolder = async (name: string) => {
  const res = await axios.post(`${API}/folders`, { name });
  return res.data;
};

export const updateFolder = async (id: number, name: string) => {
  const res = await axios.patch(
    `${API}/folders/${id}`,
    {
      name
    }
  );
  return res.data;
};

export const deleteFolder = async (id: number) => {
  const res = await axios.delete(
    `${API}/folders/${id}`
  );
  return res.data;
};