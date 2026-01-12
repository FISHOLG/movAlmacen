import { useEffect, useState } from "react";
import { AsigStore } from "../../stores/AsigStore";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPallet, faTimes } from "@fortawesome/free-solid-svg-icons";
import StepsAsig from "../Asignacion/StepsAsig";
import { useForm } from "react-hook-form";
import { anularTransForm } from "../../types";
import { AnularTrans } from "../../services/ValeService";
import { loadingSave, SwAlert } from "../../utils";

type Props = {
  changeVisibilityAsig: Function;
  camara: string;
  pallet: string;
  vale: string;
};

export default function MdlAsigaRack({
  camara,
  pallet,
  vale,
  changeVisibilityAsig,
}: Props) {
  const ubicacion = AsigStore((state) => state.ubicacion);
  const almDest = camara;
  const clearAsig = AsigStore((state) => state.clearAsig);
  const [step, setStep] = useState(1);

  const [vForm, setVForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<anularTransForm>();

  const cancelarModal = () => {
    clearAsig();
    changeVisibilityAsig();
  };

  const enviarForm = async (datos: anularTransForm) => {
    const saveAlert = await SwAlert.fire({
      title: "ANULAR?",
      text: `SE ANULARA VALE: ${vale} Y PALLET: ${pallet} SE UBICARA EN: ${ubicacion.codigo}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "CONFIRMAR",
      cancelButtonText: "CANCELAR",
    });

    if (!saveAlert.isConfirmed) return;

    loadingSave();

    const peticion = await AnularTrans(datos);

    if (!peticion["result"]) {
      return await SwAlert.fire({
        icon: "error",
        title: "OPERACION FALLIDA",
        text: "ERROR DESCONOCIDO",
        showConfirmButton: false,
        timer: 2500,
      });
    }

    if (peticion["result"] === "error") {
      return await SwAlert.fire({
        icon: "error",
        title: "OPERACION FALLIDA",
        text: peticion["message"],
        showConfirmButton: false,
        timer: 2500,
      });
    }
    await SwAlert.fire({
      icon: "success",
      title: "OPERACION EXITOSA",
      text: "SE HA ANULADO LA TRANSFERENCIA",
      showConfirmButton: false,
      timer: 2500,
    });
    reset();
    cancelarModal();
  };

  useEffect(() => {
    if (step > 5) {
      // changeVisibilityAsig();
      setVForm(true);
    }
  }, [step]);
  return (
    <div className="fixed bg-gray-700 inset-1 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-20 max-h-svh">
      <motion.div
        className="w-11/12 md:w-2/3 lg:w-4/5 bg-white  justify-center items-center overflow-y-scroll max-h-full"
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
            <FontAwesomeIcon icon={faPallet} className="mr-2" />
            SELECCIONAR UBICACION
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
          {!vForm ? (
            <StepsAsig
              step={step}
              setStep={setStep}
              propAlm={almDest.slice(-2)}
            />
          ) : (
            <>
              <form onSubmit={handleSubmit(enviarForm)}>
                <div className="w-full p-2 flex  gap-1 justify-between flex-row text-center">
                  <div className="max-w-40">
                    <label className="uppercase font-bold">VAle a Anular</label>
                    <input
                      type="text"
                      className="h-8 border-2 border-gray-300 rounded-md w-full px-2 text-center"
                      readOnly
                      value={vale}
                      {...register("numVale")}
                    />
                  </div>
                  <div className="max-w-40">
                    <label className="uppercase font-bold"># Pallet</label>
                    <input
                      type="text"
                      className="h-8 border-2 border-gray-300 rounded-md w-full px-2 text-center"
                      readOnly
                      value={pallet}
                      {...register("numPallet")}
                    />
                  </div>
                </div>
                <div className="w-full p-2 text-center">
                  <label className="w-full block uppercase font-bold">
                    Nueva Ubicación
                  </label>
                  <input
                    type="text"
                    className="h-8 border-2 border-gray-300 rounded-md w-full px-2 text-center"
                    readOnly
                    value={ubicacion.codigo}
                    {...register("ubicacion")}
                  />
                </div>
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="bg-orange-600 py-2 px-3 text-white uppercase rounded-md font-semibold"
                  >
                    Anular y Asignar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
