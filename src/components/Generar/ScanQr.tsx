import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { formQr, Infoarticulo } from "../../types";
import { SearchArticulo } from "../../services/Articulo";
import { SwAlert } from "../../utils";
import { ValeStore } from "../../stores/ValeStore";
import { useEffect } from "react";
import { ObtenerCantArticulos } from "../../services/PalletService";

type ScanQr = {
  codigo: string;
};
type Props = {
  changeVisibility: Function;
};
export default function ScanQr({ changeVisibility }: Props) {
  const { register, reset, handleSubmit, setFocus, setValue } =
    useForm<ScanQr>();
  const navigate = useNavigate();

  const setInfoArt = ValeStore((state) => state.setInfoArt);
  const setInfoPallet = ValeStore((state) => state.setInfoPallet);
  const setRefer = ValeStore((state) => state.setRefer);

  const ReturnHome = () => {
    navigate("/");
  };

  const isPallet = (codigo: string) => {
    const regex = /^[A-Za-z0-9]{2}\d{8}$/;
    return regex.test(codigo);
  };

  const enviarForm = async (datos: ScanQr) => {
    console.log("datos", datos);
    const dataQr = datos.codigo.split("|");
    const codigo = dataQr[0].toUpperCase().trim();
    const OtQr = dataQr[1] ? dataQr[1].toUpperCase().trim() : "";
    
/* ============ PALLET ================== */


// }-------------------------------fin DETALLE PIER

    const data: formQr = { codigo: codigo, operacion: "buscar" };

    const peticion = await SearchArticulo(data);

    if (peticion.result === "error") {
      //reset();
      setValue("codigo", "");
      return SwAlert.fire({
        icon: "warning",
        text: peticion.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }

    if (isPallet(codigo)) setInfoPallet(codigo);
    else {
      setInfoArt(peticion.data);
    }

    if (isPallet(codigo)) {
      const listArticulos = await ObtenerCantArticulos({
        numPallet: codigo,
      });
      const listData: Infoarticulo[] = listArticulos.data;

      if (listData.length > 1) {
        const opciones = listData.map((art) => `${art.codigo}`);

        const { value: dataArt } = await SwAlert.fire({
          title: "SELECCIONE EL ARTICULO",
          input: "radio",
          confirmButtonText: "Seleccionar",
          inputOptions: opciones,
          inputValidator: (value) => {
            if (!value) {
              return "Escoja una opción";
            }
          },
        });

        setInfoArt(listData[dataArt]);
      } else {
        setInfoArt(listData[0]);
      }
    }

    if (OtQr.length > 0) {
      const ot = {
        tipo: "",
        nro: OtQr,
        desc: "",
        nroMov: "",
        almacen: "",
        restante: "",
      };
      setRefer(ot);
    } else {
      setRefer(null);
    }
    changeVisibility(true);
    reset();
  };

  const enfocarCodigo = () => {
    setFocus("codigo");
  };

  useEffect(() => {
    enfocarCodigo();
  }, []);
  return (
    <div id="contentScan">
      <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
        <div className="px-2">
          <input
            type="text"
            className="h-10 w-full border border-gray-300 rounded-md px-2 text-xs md:text-base uppercase"
            placeholder="CODIGO DEL PALLET | ARTICULO"
            {...register("codigo", {
              required: "CODIGO QR VACIO!",
            })}
            onBlur={enfocarCodigo}
            // maxLength={11}
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
