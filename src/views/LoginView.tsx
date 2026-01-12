import { useNavigate } from "react-router";
import ImgProfile from "../assets/img/profile.png";
import { AuthStore } from "../stores/AuthStore";
import { useState } from "react";
import { loginType } from "../types";
import { IniciarSesion } from "../services/LoginService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import ErrorValid from "../components/ErrorValid";

type Login = {
  usuario: string;
  pass: string;
};

export default function LoginView() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>();

  const login = AuthStore((state) => state.logIn);
  const navigate = useNavigate();

  const [errorLogin, setErrorLogin] = useState({ error: "" });

  const submitLogin = async (datos: Login) => {
    const data: loginType = {
      ...datos,
      operacion: "login",
    };

    const service = await IniciarSesion(data);

    if (service.result === "success") {
      const { result, ...datosLogin } = service;
      login(datosLogin);
      setErrorLogin({ error: "" });
      navigate("/home/");
    } else if (service.result === "error") {
      setErrorLogin({ error: service.message });
    }

    reset();
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-orange-500">
        <div
          id="cardLogin"
          className="flex flex-col justify-around p-6 border-2 border-gray-300  rounded-xl bg-white w-5/6 md:w-2/3 lg:w-1/3"
        >
          <div id="cardHeader">
            <img
              className="w-24 mx-auto mb-3"
              src={ImgProfile}
              alt="IMG_LOGIN"
            />
            <h2 className="text-center uppercase font-bold mb-3 text-orange-600 lg:text-2xl ">
              movimientos almacen
            </h2>
          </div>
          <div id="cardBody" className="">
            <form
              onSubmit={handleSubmit(submitLogin)}
              autoComplete="off"
              className="flex flex-col gap-4"
            >
              <div className="uppercase">
                <label
                  className="block mb-1.5 font-bold text-sm md:text-base text-orange-600"
                  htmlFor=""
                >
                  usuario
                </label>
                <input
                  type="text"
                  className="h-10 w-full border-2 border-gray-300 rounded-lg px-2"
                  placeholder="USUARIO"
                  maxLength={6}
                  {...register("usuario", {
                    required: "El usuario es obligatorio",
                    maxLength: {
                      value: 6,
                      message: "El máximo son 6 caracteres",
                    },
                  })}
                />
                {errors.usuario && (
                  <ErrorValid
                    message={
                      errors.usuario.message ? errors.usuario.message : ""
                    }
                  />
                )}
              </div>
              <div className="uppercase">
                <label
                  className="block mb-1.5 font-bold text-sm md:text-base text-orange-600"
                  htmlFor=""
                >
                  contraseña
                </label>
                <input
                  type="password"
                  className="h-10 w-full border-2 border-gray-300 rounded-lg px-2"
                  placeholder="******"
                  {...register("pass", {
                    required: "La contraseña es obligatoria",
                  })}
                />
              </div>

              {errors.pass && (
                <ErrorValid
                  message={errors.pass.message ? errors.pass.message : ""}
                />
              )}

              {errorLogin.error.length > 0 && (
                <ErrorValid
                  message={errorLogin.error ? errorLogin.error : ""}
                />
              )}

              <div>
                <button
                  type="submit"
                  className="block w-full uppercase  bg-orange-600 text-white h-10 font-bold hover:cursor-pointer hover:bg-orange-700"
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                  ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
