import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getCommentsAsync(
  navigate,
  pageLength,
  pageNumber,
  matchId
) {
  try {
    const response = await API.get(
      `/comment?pageSize=${pageLength}&pageNumber=${pageNumber}&matchId=${matchId}&orderBy=\"Comment\".\"DateCreated\"`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getCommentByIdAsync(id, navigate) {
  try {
    const response = await API.get(`/comment/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewCommentAsync(comment, navigate) {
  try {
    await API.post("/comment", comment, { headers: getHeaders() });
    toast.success("Uspješno kreirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateCommentByIdAsync(id, comment, navigate) {
  try {
    await API.put(`/comment/${id}`, comment, { headers: getHeaders() });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteCommentByIdAsync(id, navigate) {
  try {
    await API.delete(`/comment/toggle/${id}`, { headers: getHeaders() });
    toast.success("Uspješno!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
