import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useResultContext } from "../context/ResultContext";
import {
  stringDe,
  stringEn,
  stringEs,
  stringFr,
  stringHr,
  stringSv,
} from "../services/TranslateService";

export default function Register() {
  const formRef = useRef();
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);

  const navigate = useNavigate();

  const { setAuthenticatedUser, lang, setLang } = useResultContext();

  const langParsed = JSON.parse(lang);

  useEffect(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem("token");
  }, []);

  function handleOnInput() {
    const confirmPasswordInput = formRef.current.elements.confirmPassword;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    if (data.password !== data.confirmPassword) {
      confirmPasswordInput.setCustomValidity("Password doesn't match");
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
        toast.success(langParsed.strSuccessfulyRegistration);
        navigate("/login");
      })
      .catch((err) => {
        if (!err.response.data.modelState) {
          toast.error(langParsed.strError);
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
      <select
        className="form-control position-absolute lang-select"
        defaultValue={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value={JSON.stringify(stringHr)}>HR</option>
        <option value={JSON.stringify(stringEn)}>EN</option>
        <option value={JSON.stringify(stringDe)}>DE</option>
        <option value={JSON.stringify(stringFr)}>FR</option>
        <option value={JSON.stringify(stringEs)}>ES</option>
        <option value={JSON.stringify(stringSv)}>SW</option>
      </select>
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
            {isEmailUnique
              ? langParsed.strWrongEmail
              : langParsed.strAlreadyInUseEmail}
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
            {isUsernameUnique
              ? langParsed.strRequired
              : langParsed.strAlreadyInUseUserName}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            {langParsed.strPassword}
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
          <div className="invalid-feedback">{langParsed.strPasswordLenght}</div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="form-label">
            {langParsed.strConfirmPassword}
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
            {langParsed.strRepeatedPasswordNotValid}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {langParsed.strRegister}
        </button>
      </form>
    </div>
  );
}
