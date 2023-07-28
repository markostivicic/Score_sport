import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";

export default function Login() {
  const navigate = useNavigate();
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const { setAuthenticatedUser } = useResultContext();

  async function handleOnSubmitAsync(e) {
    e.preventDefault();
    const form = e.target;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const loginCredentials = {
      username: form.elements["email"].value,
      password: form.elements["password"].value,
      grant_type: "password",
    };
    try {
      const response = await axios.post(
        "https://localhost:44345/login",
        loginCredentials,
        {
          headers: headers,
        }
      );
      setIsWrongPassword(false);
      localStorage.setItem("token", response.data.access_token);
      setAuthenticatedUser({
        username: response.data.userName,
        role: response.data.role,
      });
      navigate("/");
    } catch (err) {
      setIsWrongPassword(true);
    }
  }

  return (
    <div className="d-flex justify-content-center flex-column align-items-center vw-100 vh-100">
      <form
        onSubmit={handleOnSubmitAsync}
        className="d-flex flex-column gap-3 width-400 px-2"
      >
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            className="form-control"
            type="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Lozinka
          </label>
          <input
            id="password"
            name="password"
            className={`form-control`}
            type="password"
            required
          />
        </div>
        {isWrongPassword && (
          <p className="text-danger text-center">
            Pogrešno korisničko ime ili lozinka
          </p>
        )}
        <button type="submit" className="btn btn-primary">
          Prijava
        </button>
      </form>
      <p role="button" className="my-4" onClick={() => navigate("/register")}>
        Kreiraj novi profil
      </p>
    </div>
  );
}
