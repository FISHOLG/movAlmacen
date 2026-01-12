import "animate.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DateServer } from "../services/Reloj";

const MySwal = withReactContent(Swal);

const SwAlert = MySwal.mixin({
  allowEscapeKey: false,
  allowOutsideClick: () => {
    const popup = Swal.getPopup() as HTMLElement;
    popup.classList.remove("swal2-show");
    setTimeout(() => {
      popup.classList.add("animate__animated", "animate__headShake");
    });
    setTimeout(() => {
      popup.classList.remove("animate__animated", "animate__headShake");
    }, 500);
    return false;
  },
});

const formatearNumero = (numero: number) => {
  if (numero > 999) {
    return numero.toFixed(4);
  }
  return numero.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

let loadingSave = () => {
  MySwal.fire({
    title: "",
    html: "<h2 class='text-orange-600 m-0 '>GUARDANDO</h2>",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      MySwal.showLoading();
    },
  });
};

const generarID = () => {
  let fecha = Date.now();
  let aleadotrio = Math.random().toFixed(10);
  let numRandom = parseFloat(aleadotrio);

  let id = `${fecha.toString(25)}-${numRandom.toString(25).substring(2)}`;

  return id;
};

const FechaHora = async () => {
  const peticion = await DateServer();
  return peticion.fecha + "T" + peticion.hora;
};

const aleatorioEntero = (max: number) => {
  return Math.floor(Math.random() * max).toString();
};

export {
  formatearNumero,
  loadingSave,
  SwAlert,
  generarID,
  FechaHora,
  aleatorioEntero,
};
