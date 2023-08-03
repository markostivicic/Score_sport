import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getCountriesAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/country?pageSize=${pageLength}&pageNumber=${pageNumber}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getCountriesWithFiltersAsync(
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
      `/country?pageSize=${pageLength}&pageNumber=${pageNumber}&sortOrder=${sortOrder}&orderBy=${orderBy}&isActive=${isActive}&name=${searchFilter}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getCountryByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/country/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewCountryAsync(country, navigate) {
  try {
    await API.post("/country", country, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateCountryByIdAsync(id, country, navigate) {
  try {
    await API.put(`/country/${id}`, country, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteCountryByIdAsync(id, navigate) {
  try {
    await API.delete(`/country/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
