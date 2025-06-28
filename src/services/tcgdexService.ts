import axios from "axios";

const API_BASE_URL = "https://api.tcgdex.net/v2/pt";

const tcgdex = axios.create({
  baseURL: API_BASE_URL,
});

export const getAllCards = async () => {
  const response = await tcgdex.get("/cards");
  return response.data;
};

export const getCardById = async (id: string) => {
  const response = await tcgdex.get(`/cards/${id}`);
  return response.data;
};
