import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getClubsAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/club?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getClubsWithFiltersAsync(
  navigate,
  pageLength,
  pageNumber,
  isActive,
  searchFilter,
  orderBy,
  sortOrder
) {
  try {
    const response = await API.get(
      `/club?pageSize=${pageLength}&pageNumber=${pageNumber}&isActive=${isActive}&name=${searchFilter}&orderBy=${orderBy}&sortOrder=${sortOrder}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getClubsWithSearchFilterAsync(
  navigate,
  pageLength,
  pageNumber,
  searchFilter
) {
  try {
    const response = await API.get(
      `/club?pageSize=${pageLength}&pageNumber=${pageNumber}&name=${searchFilter}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getClubsFilteredByLeagueAsync(
  navigate,
  pageLength,
  pageNumber,
  leagueId,
  orderBy,
  sortOrder
) {
  try {
    const response = await API.get(
      `/club?pageSize=${pageLength}&pageNumber=${pageNumber}&leagueId=${leagueId}&orderBy=${
        orderBy || ""
      }&sortOrder=${sortOrder || ""}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getClubByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/club/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewClubAsync(club, navigate) {
  try {
    await API.post("/club", club, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateClubByIdAsync(id, club, navigate) {
  try {
    await API.put(`/club/${id}`, club, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteClubByIdAsync(id, navigate) {
  try {
    await API.delete(`/club/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
