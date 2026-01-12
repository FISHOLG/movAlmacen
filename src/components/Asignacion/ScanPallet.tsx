import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { almBD, searchFormPallet } from "../../types";
import { SwAlert } from "../../utils";
import { SearchPallet } from "../../services/PalletService";
import { AsigStore } from "../../stores/AsigStore";
import { AlmacenesUbic } from "../../services/almacenService";

type Scan = {
  codigo: string;
};

export default function ScanPallet() {
  const navigate = useNavigate();
  const setInfo = AsigStore((state) => state.setInfo);
  const setAlm = AsigStore((state) => state.setAlm);
  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    // setValue,
    // formState: { errors },
  } = useForm<Scan>();

  function isPallet(codigo: string) {
    const regex = /^PA\d{8}$/;
    return regex.test(codigo);
  }

  const ReturnHome = () => {
    navigate("/");
  };

  const enviarForm = async (data: Scan) => {
    /* VERIFICAR QUE CUMPLA EL FORMATO DE PALLET */
    const codigo = data.codigo.toUpperCase();
    if (!isPallet(codigo)) {
      SwAlert.fire({
        icon: "warning",
        text: "FORMATO INVALIDO",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      return;
    }

    const datos: searchFormPallet = {
      numPallet: codigo,
      operacion: "search",
    };

    const peticion = await SearchPallet(datos);
    if (peticion.length === 0) {
      SwAlert.fire({
        icon: "warning",
        text: "NO SE HA ENCONTRADO PALLET",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      return;
    }

    if (peticion["estado"] === "ANULADO") {
      SwAlert.fire({
        icon: "warning",
        text: "PALLET SE ENCUENTRA ANULADO",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      return;
    }

    if (peticion["estado"] === "CERRADO") {
      SwAlert.fire({
        icon: "warning",
        text: "PALLET SE ENCUENTRA CERRADO",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      return;
    }

    if (peticion["ubicacion"].length > 0) {
      const reasignar = await SwAlert.fire({
        icon: "warning",
        text: "PALLET YA TIENE UBICACIÓN ASIGNADA. ¿DESEA REASIGNAR?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "REASIGNAR",
        cancelButtonText: "CANCELAR",
        // timer: 1500,
      });

      if (!reasignar.isConfirmed) {
        reset();
        return;
      } else {
        const petAlm: almBD = await AlmacenesUbic({
          almacen: peticion["ubicacion"].substr(0, 2),
          condicion: "1",
        });

        setAlm(petAlm.almacen);
      }
    }

    setInfo(peticion);

    reset();
  };

  useEffect(() => {
    setFocus("codigo");
  }, [setFocus]);

  return (
    <div id="contentScan" className="">
      <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
        <div className="px-2">
          <input
            type="text"
            className="h-8 w-full border border-gray-300 rounded-md px-2 text-xs md:text-base uppercase"
            placeholder="CODIGO DEL PALLET"
            maxLength={10}
            {...register("codigo", {
              required: "CODIGO QR VACIO!",
            })}
          />
          <span className="block uppercase text-center text-gray-400 text-xs md:text-base pt-1">
            esperando codigo qr
          </span>
          <div id="spinQR"></div>
        </div>
      </form>
      <div className="absolute bottom-3 w-full px-2">
        <button
          className="w-full py-2 uppercase bg-red-600 text-white text-xs md:text-base font-bold rounded-md"
          onClick={ReturnHome}
        >
          <FontAwesomeIcon icon={faTimes} className="me-2" size="lg" />
          cancelar escaneo
        </button>
      </div>
    </div>
  );
}
