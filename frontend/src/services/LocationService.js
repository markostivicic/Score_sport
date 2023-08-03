import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getLocationsAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/location?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getLocationsWithFiltersAsync(
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
      `/location?pageSize=${pageLength}&pageNumber=${pageNumber}&isActive=${isActive}&name=${searchFilter}&address=${searchFilter}&orderBy=${orderBy}&sortOrder=${sortOrder}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getLocationByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/location/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewLocationAsync(location, navigate) {
  try {
    await API.post("/location", location, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateLocationByIdAsync(id, location, navigate) {
  try {
    await API.put(`/location/${id}`, location, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteLocationByIdAsync(id, navigate) {
  try {
    await API.delete(`/location/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
