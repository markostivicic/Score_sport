import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getFavouriteMatchsAsync(
  navigate,
  pageLength,
  pageNumber
) {
  try {
    const response = await API.get(
      `/favouriteMatch?pageSize=${pageLength}&pageNumber=${pageNumber}&isActive=true`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getFavouriteMatchByMatchIdAsync(
  navigate,
  matchId,
  isActive
) {
  try {
    const response = await API.get(
      `/favouriteMatch?pageSize=100&pageNumber=0&matchId=${matchId}${
        isActive !== undefined && `&isActive=${isActive}`
      }`,
      { headers: getHeaders() }
    );
    return response.data.items[0] || null;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function changeFavouriteMatchStatusAsync(
  navigate,
  newStatus,
  matchId
) {
  try {
    const favouriteMatch = await getFavouriteMatchByMatchIdAsync(
      navigate,
      matchId,
      null
    );
    if (
      (newStatus === false && favouriteMatch) ||
      (newStatus === true && favouriteMatch)
    ) {
      await deleteFavouriteMatchByIdAsync(favouriteMatch.id, navigate);
      return;
    }

    if (newStatus === true && !favouriteMatch) {
      await createNewFavouriteMatchAsync({ matchId }, navigate);
      return;
    }

    toast.error("Greška!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewFavouriteMatchAsync(favouriteMatch, navigate) {
  try {
    await API.post("/favouriteMatch", favouriteMatch, {
      headers: getHeaders(),
    });
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateFavouriteMatchByIdAsync(
  id,
  favouriteMatch,
  navigate
) {
  try {
    await API.put(`/favouriteMatch/${id}`, favouriteMatch, {
      headers: getHeaders(),
    });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteFavouriteMatchByIdAsync(id, navigate) {
  try {
    await API.delete(`/favouriteMatch/toggle/${id}`, { headers: getHeaders() });
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
