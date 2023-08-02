import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";
import { useEffect } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const navigate = useNavigate();
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const { setAuthenticatedUser } = useResultContext();

  useEffect(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem("token");
  }, []);

  async function handleOnSubmitAsync(e) {
    e.preventDefault();
    const form = e.target;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const loginCredentials = {
      username: form.elements["username"].value,
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
      <Form handleOnSubmit={handleOnSubmitAsync} buttonText="Prijava">
        <Input
          id="username"
          type="text"
          wrapperClassName="my-2"
          labelText="Korisničko ime"
          isInputGroup
          icon={faUser}
        />
        <Input
          id="password"
          type="password"
          labelText="Lozinka"
          wrapperClassName="my-4"
          isInputGroup
          icon={faLock}
        />
      </Form>
      {isWrongPassword && (
        <p className="text-danger text-center my-3">
          Pogrešno korisničko ime ili lozinka
        </p>
      )}
      <p role="button" className="my-4" onClick={() => navigate("/register")}>
        Kreiraj novi profil
      </p>
    </div>
  );
}
