import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getLeaguesAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/league?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getLeaguesWithFiltersAsync(
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
      `/league?pageSize=${pageLength}&pageNumber=${pageNumber}&isActive=${isActive}&name=${searchFilter}&orderBy=${orderBy}&sortOrder=${sortOrder}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getLeaguesWithSearchFilterAsync(
  navigate,
  pageLength,
  pageNumber,
  searchFilter
) {
  try {
    const response = await API.get(
      `/league?pageSize=${pageLength}&pageNumber=${pageNumber}&name=${searchFilter}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getLeaguesFilteredBySportAsync(
  navigate,
  pageLength,
  pageNumber,
  sportId
) {
  try {
    const response = await API.get(
      `/league?pageSize=${pageLength}&pageNumber=${pageNumber}&sportId=${
        sportId ? sportId : ""
      }`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getLeagueByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/league/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewLeagueAsync(league, navigate) {
  try {
    await API.post("/league", league, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateLeagueByIdAsync(id, league, navigate) {
  try {
    await API.put(`/league/${id}`, league, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteLeagueByIdAsync(id, navigate) {
  try {
    await API.delete(`/league/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
