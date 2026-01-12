import { faQrcode, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ErrorValid from "../ErrorValid";
import { SwAlert } from "../../utils";
import { detallePallet } from "../../types";
import { GetDataPallet } from "../../services/PalletService";
import { ValeStore } from "../../stores/ValeStore";

type Props = {
  changeVMdlPallet: Function;
};
type Form = {
  codigo: string;
};
export default function MdlScanPallet({ changeVMdlPallet }: Props) {
  const infoRefer = ValeStore((state) => state.infoRefer);
  const infoDet = ValeStore((state) => state.infoDet);
  const infoArt = ValeStore((state) => state.infoArt);
  const infoPallet = ValeStore((state) => state.infoPallet);
  const setInfoDet = ValeStore((state) => state.setInfoDet);
  const setInfoPallet = ValeStore((state) => state.setInfoPallet);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<Form>();

  const cancelarModal = () => {
    changeVMdlPallet();
  };

  const enfocarCodigo = () => {
    setFocus("codigo");
  };

  const enviarForm = async (data: Form) => {
    const numPalet = data.codigo.toUpperCase();
    // Validar no exista en la lista

    const verifica = infoPallet.find((pallet) => pallet == numPalet);

    if (verifica === undefined) setInfoPallet(numPalet);
    else {
      return await SwAlert.fire({
        icon: "warning",
        text: "ESTE PALLET YA HA SIDO AGREGADO",
        showConfirmButton: false,
        timer: 2500,
      });
    }

    const dataPallet = {
      numPallet: numPalet,
      iTmov: "S",
      operacion: "dataPallet",
      articulo: infoArt ? infoArt.codigo : "",
    };
    const peticion = await GetDataPallet(dataPallet);

    if (infoRefer?.almacen !== peticion.dataAlmacen) {
      await SwAlert.fire({
        text: "PALLET NO PERTENECE A ESTE ALMACEN",
        icon: "warning",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    if (!peticion.dataItems) {
      await SwAlert.fire({
        text: "NO SE HAN ENCONTRADO ITEMS",
        icon: "warning",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    if (peticion["dataArticulo"]["codigo"] !== infoArt?.codigo) {
      await SwAlert.fire({
        text: "LOS CODIGOS NO COINCIDEN",
        icon: "warning",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    const datos: detallePallet[] = peticion["dataItems"].map(
      (item: detallePallet) => {
        return { ...item, referencia: infoRefer, visible: true };
      }
    );

    const nuevoDet = infoDet ? infoDet.concat(datos) : datos;

    setInfoDet(nuevoDet);

    reset();

    cancelarModal();
  };

  useEffect(() => {
    enfocarCodigo();
  }, []);
  return (
    <div className="fixed bg-gray-700 inset-1 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-20">
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
            Escanear QR pallet
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
          <form
            onSubmit={handleSubmit(enviarForm)}
            autoComplete="off"
            className="mb-1"
          >
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
