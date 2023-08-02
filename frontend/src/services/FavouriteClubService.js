import { getHeaders, redirectToLoginIfNeeded } from "./AuthService";
import API from "./AxiosService";
import { toast } from "react-toastify";

export async function getFavouriteClubsAsync(navigate, pageLength, pageNumber) {
  try {
    const response = await API.get(
      `/favouriteClub?pageSize=${pageLength}&pageNumber=${pageNumber}&isActive=true`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function getFavouriteClubByClubIdAsync(
  navigate,
  clubId,
  isActive
) {
  try {
    const response = await API.get(
      `/favouriteClub?pageSize=100&pageNumber=0&clubId=${clubId}${
        isActive !== undefined && `&isActive=${isActive}`
      }`,
      { headers: getHeaders() }
    );
    return response.data.items[0] || null;
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function changeFavouriteClubStatusAsync(
  navigate,
  newStatus,
  clubId
) {
  try {
    const favouriteClub = await getFavouriteClubByClubIdAsync(
      navigate,
      clubId,
      null
    );
    if (
      (newStatus === false && favouriteClub) ||
      (newStatus === true && favouriteClub)
    ) {
      await deleteFavouriteClubByIdAsync(favouriteClub.id, navigate);
      return;
    }

    if (newStatus === true && !favouriteClub) {
      await createNewFavouriteClubAsync({ clubId }, navigate);
      return;
    }

    toast.error("Greška!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function createNewFavouriteClubAsync(favouriteClub, navigate) {
  try {
    await API.post("/favouriteClub", favouriteClub, { headers: getHeaders() });
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function updateFavouriteClubByIdAsync(
  id,
  favouriteClub,
  navigate
) {
  try {
    await API.put(`/favouriteClub/${id}`, favouriteClub, {
      headers: getHeaders(),
    });
    toast.success("Uspješno ažurirano!");
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}

export async function deleteFavouriteClubByIdAsync(id, navigate) {
  try {
    await API.delete(`/favouriteClub/toggle/${id}`, { headers: getHeaders() });
  } catch (error) {
    redirectToLoginIfNeeded(navigate, error, toast);
  }
}
