import { faQrcode, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import ErrorValid from "../ErrorValid";
import {
  // GetDataPallet,
  GetDataPalletTrans,
  SearchPallet,
} from "../../services/PalletService";
import { TransferStore } from "../../stores/TransferStore";
import { SwAlert } from "../../utils";
import { useEffect, useRef } from "react";
import { detallePallet } from "../../types";
import { AsigStore } from "../../stores/AsigStore";

type Props = {
  changeVisiPallet: Function;
};
type Form = {
  codigo: string;
};
export default function MdlScanPallet({ changeVisiPallet }: Props) {
  const {
    register,
    handleSubmit,
    // reset,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<Form>();

  const almOrg = TransferStore((state) => state.almOrg);
  const almDest = TransferStore((state) => state.almDest);
  const setInfoPallet = TransferStore((state) => state.setInfoPallet);
  const setInfoArt = TransferStore((state) => state.setInfoArt);
  //const infoArt = TransferStore((state) => state.infoArt);
  const setInfoDet = TransferStore((state) => state.setInfoDet);
  const setUbicacionD = AsigStore((state) => state.setUbicacionD);
  //const dropAll = TransferStore((state) => state.dropAll);

  const tipoData = useRef<string>("0");

  const cancelarModal = () => {
    // dropAll();
    changeVisiPallet();
  };

  const enviarForm = async (datos: Form) => {
    try {
      if (!almOrg) throw new Error("NO EXISTE ALMACEN ORIGEN");

      const dataSearch = {
        numPallet: datos["codigo"].toUpperCase(),
        operacion: "search",
      };

      const searchPeticion = await SearchPallet(dataSearch);

      const ubicacion: string = searchPeticion.ubicacion;

      if (!almDest) throw new Error("DEBE SELECCIONAR DESTINO");

      if (
        ubicacion.length > 0 &&
        almOrg.almacen == "" &&
        !almDest.almacen.includes(ubicacion.substring(0, 2))
      ) {
        throw new Error("ESTE PALLET YA TIENE UBICACION ASIGNADA");
      }

      if (
        almOrg.almacen === "" &&
        almDest.almacen.includes(ubicacion.substring(0, 2)) &&
        ubicacion.length > 0
      ) {
        console.log(ubicacion);
        tipoData.current = "1";
      }

      /*  if (ubicacion == "" && almOrg.almacen != "")
        throw new Error("ESTE PALLET NO PERTENECE A CAMARA ORIGEN"); */

      if (
        (almOrg.almacen != "" &&
          !almOrg.almacen.includes(ubicacion.substring(0, 2))) ||
        (ubicacion == "" && almOrg.almacen != "")
      ) {
        throw new Error("ESTE PALLET NO PERTENECE A CAMARA ORIGEN");
      }

      if (ubicacion === undefined) {
        throw new Error("No Existe Ubicacion");
      }

      const dataPallet = {
        numPallet: datos["codigo"].toUpperCase(),
        almacen: almDest?.codigo || "",
        tipo: tipoData.current,
      };

      const peticion = await GetDataPalletTrans(dataPallet);

      if (peticion.result && peticion.result === "error")
        throw new Error(peticion.message);

      if (peticion.dataItems.length == 0) {
        throw new Error("NO HAY ARTICULOS DISPONIBLES PARA TRANSFERIR");
      }

      if (peticion.dataArticulo === null) {
        throw new Error("NO EXISTE INFORMACION DE PALLET");
      }

      setInfoArt(peticion.dataArticulo);

      const items = peticion.dataItems.map((dat: detallePallet) => ({
        ...dat,
        visible: true,
      }));

      setInfoDet(items);
      setInfoPallet(datos.codigo);

      console.log(ubicacion);

      if (
        almDest.almacen.includes(ubicacion.substring(0, 2)) &&
        ubicacion !== ""
      ) {
        setUbicacionD(ubicacion);
      }
      changeVisiPallet();
    } catch (error: any) {
      SwAlert.fire({
        icon: "warning",
        title: "ADVERTENCIA",
        text: error.message,
        showConfirmButton: false,
        timer: 2500,
      });

      setValue("codigo", "");
    }
  };

  const enfocarCodigo = () => {
    setFocus("codigo");
  };

  useEffect(() => {
    enfocarCodigo();
  }, []);
  return (
    <div className="fixed bg-gray-700 inset-1 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10">
      <motion.div
        className="w-11/12 md:w-2/3 lg:w-4/5 bg-white  justify-center items-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeIn",
        }}
      >
        {/* CARD HEADER */}
        <div className="h-12 bg-orange-600 flex  items-center w-full justify-between">
          <h3 className="text-sm md:text-base text-white font-bold uppercase p-5 ">
            <FontAwesomeIcon icon={faQrcode} className="mr-2" />
            Escanear QR
          </h3>
          <button
            className="px-5 text-lg text-gray-600 font-extrabold"
            onClick={cancelarModal}
          >
            <FontAwesomeIcon icon={faTimes} size="xl" />
          </button>
        </div>
        {/* CARD BODY */}
        <div className="bg-white w-full p-3">
          <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
            <input
              type="text"
              className="w-full h-10 border border-gray-300 rounded-md px-2 uppercase"
              placeholder="ESCANEAR QR PALLET"
              maxLength={10}
              {...register("codigo", {
                pattern: {
                  value: /^[Pp][Aa]\d{8}$/,
                  message: "NO CUMPLE CON EL FORMATO",
                },
              })}
              onBlur={enfocarCodigo}
            />
          </form>
          {errors.codigo && (
            <ErrorValid
              message={errors.codigo.message ? errors.codigo.message : ""}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
