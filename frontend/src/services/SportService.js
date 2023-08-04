import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getSportsAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/sport?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getSportsWithFiltersAsync(
  navigate,
  pageLength,
  pageNumber,
  sortOrder,
  orderBy,
  isActive,
  searchFilter
) {
  try {
    const response = await API.get(
      `/sport?pageSize=${pageLength}&pageNumber=${pageNumber}&sortOrder=${sortOrder}&orderBy=${orderBy}&isActive=${isActive}&name=${searchFilter}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getSportByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/sport/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewSportAsync(sport, navigate) {
  try {
    await API.post("/sport", sport, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateSportByIdAsync(id, sport, navigate) {
  try {
    await API.put(`/sport/${id}`, sport, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteSportByIdAsync(id, navigate) {
  try {
    await API.delete(`/sport/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
