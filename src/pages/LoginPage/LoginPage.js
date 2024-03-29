import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/images/logo.png";
import { accentColor, textColor } from "../../constants/colors";
import axios from "axios";
import { BASE_URL } from "../../constants/urls";
import { ThreeDots } from "react-loader-spinner";
import UserContext from "../../contexts/UserContext";

export default function LoginPage() {
  const { userData, setUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [checkKeepSignedInIn, setCheckKeepSignedInIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("LoginPage");
    if (localStorage.getItem("localUser")) {
      navigate("/hoje");
    }
  }, [userData]);

  function handleForm(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleCheck() {
    setCheckKeepSignedInIn(!checkKeepSignedInIn);
  }

  function login(e) {
    e.preventDefault();
    setIsLoading(true);
    const body = { ...form };
    axios
      .post(`${BASE_URL}/auth/login`, body)
      .then((res) => {
        const respData = {
          id: res.data.id,
          name: res.data.name,
          image: res.data.image,
          requestConfig: {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
            },
          },
        };
        setUserData(respData);
        setForm({ email: "", password: "" });
        setIsLoading(false);
        if (checkKeepSignedInIn)
          localStorage.setItem("localUser", JSON.stringify(respData));
        else navigate("/hoje");
      })
      .catch((err) => {
        alert(err.response.data.message);
        setIsLoading(false);
      });
  }

  const renderButtonLabel = function () {
    return isLoading ? (
      <ThreeDots
        height="60"
        width="60"
        radius="7"
        color="#FFF"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    ) : (
      "Entrar"
    );
  };

  return (
    <ContainerLogin>
      <img src={logo} className="logo" alt="Logo Track It" />
      <form onSubmit={login}>
        <input
          name="email"
          value={form.email}
          onChange={handleForm}
          placeholder="email"
          type="email"
          disabled={isLoading}
          required
          data-identifier="input-email"
        ></input>
        <input
          name="password"
          value={form.password}
          onChange={handleForm}
          type="password"
          placeholder="senha"
          disabled={isLoading}
          required
          data-identifier="input-password"
        ></input>
        <button
          className="btn"
          type="submit"
          disabled={isLoading}
          data-identifier="login-btn"
        >
          {renderButtonLabel()}
        </button>
        <label htmlFor="keepSignedInIn">
          <input
            className="checkbox"
            name="keepSignedInIn"
            id="keepSignedInIn"
            type="checkbox"
            checked={checkKeepSignedInIn}
            onChange={handleCheck}
          ></input>
          Manter Conectado
        </label>
      </form>
      <Link to="/cadastro" data-identifier="sign-up-action">
        <p className="text-accent">Não tem uma conta? Cadastre-se!</p>
      </Link>
    </ContainerLogin>
  );
}

const ContainerLogin = styled.main`
  width: 100vw;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  .logo {
    width: 180px;
  }
  .text-accent {
    color: ${accentColor};
    font-size: 14px;
    line-height: 18px;
    text-decoration: underline;
  }
  label {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  .checkbox {
    width: 20px;
    height: 20px;
    accent-color: ${accentColor};
    border-radius: 50%;
    -webkit-border-radius: 50px;
    -moz-border-radius: 50px;
    border-radius: 50px;
  }
  .checkbox:checked {
  }
`;
