import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getPlayersAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/player?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getPlayerByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/player/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewPlayerAsync(player, navigate) {
  try {
    await API.post("/player", player, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updatePlayerByIdAsync(id, player, navigate) {
  try {
    await API.put(`/player/${id}`, player, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deletePlayerByIdAsync(id, navigate) {
  try {
    await API.delete(`/player/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno obrisano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
