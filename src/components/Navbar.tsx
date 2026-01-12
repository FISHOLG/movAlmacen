import { useEffect, useRef, useState } from "react";
import Logo from "../assets/img/logo.png";
import Profile from "../assets/img/profile.png";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { AuthStore } from "../stores/AuthStore";

export default function Navbar() {
  const [navState, setNavState] = useState(false);
  const navigate = useNavigate();
  const refNav = useRef<HTMLDivElement>(null);
  const refBtn = useRef<HTMLButtonElement>(null);

  const logOut = AuthStore((state) => state.logOuth);
  const dataAuth = AuthStore((state) => state.auth);

  const changeStateNav = () => {
    setNavState(!navState);
  };

  const ClickFuera = (event: MouseEvent) => {
    if (
      refNav.current &&
      refBtn.current &&
      !refNav.current.contains(event.target as Node) &&
      !refBtn.current.contains(event.target as Node)
    ) {
      setNavState(false);
    }
  };

  const Redirigir = () => {
    navigate("/");
  };

  const CerrarSesion = () => {
    logOut();
    Redirigir();
  };

  useEffect(() => {
    document.addEventListener("mousedown", ClickFuera);
  }, []);

  return (
    <>
      <nav className="flex justify-between px-4 bg-orange-600 py-2">
        <div className="flex gap-3 items-center" onClick={Redirigir}>
          <img src={Logo} alt="IMG_Logo" className="w-10 md:w-12" />
          <span className="uppercase text-white font-bold text-base md:text-2xl">
            mov. almacen
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              className="w-10 md:w-12 after:content-[''] after:absolute after:w-2 after:h-2 after:rounded-full after:bg-green-400 after:bottom-0 after:right-1 after:outline  after:outline-2 after: after:outline-white	"
              ref={refBtn}
              onClick={changeStateNav}
            >
              <img src={Profile} alt="User" className="w-10 md:w-full" />
            </button>
            <div
              ref={refNav}
              id="card_login"
              className={`${
                navState
                  ? "absolute w-72 border-2 border-slate-600 bg-slate-600 right-0 px-3 rounded-md mt-2 z-20"
                  : "hidden"
              }`}
            >
              <div className="flex border-b border-gray-400 items-center py-2">
                <div className="">
                  <img
                    src={Profile}
                    alt="User_Avatar"
                    className="w-10 md:w-12"
                  />
                </div>
                <div className="px-3 uppercase">
                  <span className="block font-bold text-white">
                    {dataAuth["nombre"]}
                  </span>
                  <span className="block font-semibold text-gray-300 text-sm">
                    {dataAuth["usuario"]}
                  </span>
                </div>
              </div>
              <div className="py-2 px-3">
                <button
                  className="block text-right w-full font-bold text-red-600 uppercase"
                  onClick={CerrarSesion}
                >
                  <FontAwesomeIcon icon={faPowerOff} className="me-2" />
                  <span className="text-white">Cerrar Sesion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
