export function redirectToLoginIfNeeded(navigate, error, toast) {
  if (error.response?.status !== 401) {
    toast.error("Nešto je pošlo po zlu");
    return;
  }
  navigate("/login", { replace: true });
}

export function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}
