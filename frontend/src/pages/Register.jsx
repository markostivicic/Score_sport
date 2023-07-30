import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";

export default function Register() {
  const formRef = useRef();
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);

  const navigate = useNavigate();

  const { setAuthenticatedUser } = useResultContext();

  useEffect(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem("token");
  }, []);

  function handleOnInput() {
    const confirmPasswordInput = formRef.current.elements.confirmPassword;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    if (data.password !== data.confirmPassword) {
      confirmPasswordInput.setCustomValidity("Password doesnt match");
      return;
    }
    confirmPasswordInput.setCustomValidity("");
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
      form.className += " was-validated";
      return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    axios
      .post("https://localhost:44345/api/account/register", data)
      .then((res) => {
        toast.success("Uspješna registracija");
        navigate("/login");
      })
      .catch((err) => {
        if (!err.response.data.modelState) {
          toast.error("Dogodila se pogreška");
          return;
        }
        const errors = err.response.data.modelState[""];
        if (errors.includes(`Name ${data.username} is already taken.`)) {
          form.elements.username.className = "form-control is-invalid";
          setIsUsernameUnique(false);
        }
        if (errors.includes(`Email '${data.email}' is already taken.`)) {
          form.elements.email.className = "form-control is-invalid";
          setIsEmailUnique(false);
        }
      });
  }
  return (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
      <form
        ref={formRef}
        noValidate
        className={`d-flex flex-column gap-3 width-400 px-2`}
        onSubmit={handleOnSubmit}
        onInput={handleOnInput}
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
            onInput={() => {
              setIsEmailUnique(true);
              formRef.current.elements.email.className = "form-control";
            }}
          />
          <div className="valid-feedback">Validan email</div>
          <div className="invalid-feedback">
            {isEmailUnique ? "Email nije validan" : "Ovaj email se već koristi"}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="form-label">
            Korisničko ime
          </label>
          <input
            id="username"
            name="username"
            className="form-control"
            type="text"
            required
            onInput={() => {
              setIsUsernameUnique(true);
              formRef.current.elements.username.className = "form-control";
            }}
          />
          <div className="invalid-feedback">
            {isUsernameUnique ? "Obvezno" : "Ovo korisničko ime se već koristi"}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Lozinka
          </label>
          <input
            id="password"
            name="password"
            className="form-control"
            type="password"
            required
            minLength={6}
          />
          <div className="valid-feedback">Validna lozinka</div>
          <div className="invalid-feedback">
            Lozinka mora imati barem 6 znakova
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Potvrdi lozinku
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            type="password"
            required
            minLength={6}
          />
          <div className="invalid-feedback">
            Ponovljena lozinka nije validna
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}
