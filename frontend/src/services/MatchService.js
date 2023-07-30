import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getMatchesAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/match?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getMatchesFilteredByLeagueAndDateAsync(
  navigate,
  pageLength,
  pageNumber,
  leagueId,
  date
) {
  try {
    const response = await API.get(
      `/match?pageSize=${pageLength}&pageNumber=${pageNumber}&leagueId=${leagueId}&time=${date}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getMatchByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/match/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewMatchAsync(match, navigate) {
  try {
    await API.post("/match", match, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateMatchByIdAsync(id, match, navigate) {
  try {
    await API.put(`/match/${id}`, match, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteMatchByIdAsync(id, navigate) {
  try {
    await API.delete(`/match/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno obrisano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
