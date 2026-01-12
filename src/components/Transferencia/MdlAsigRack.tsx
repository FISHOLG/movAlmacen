import { faPallet, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { motion } from "motion/react";
import StepsAsig from "../Asignacion/StepsAsig";
import { useEffect, useState } from "react";
import { TransferStore } from "../../stores/TransferStore";
import { AsigStore } from "../../stores/AsigStore";
//import { listarAlmacenes } from "../../services/almacenService";
//import { almBD } from "../../types";

type Props = {
  changeVisibilityAsig: Function;
};

export default function MdlAsigRack({ changeVisibilityAsig }: Props) {
  const almDest = TransferStore((state) => state.almDest);
  const clearAsig = AsigStore((state) => state.clearAsig);
  const [step, setStep] = useState(1);
  //const [esperando, setEsperando] = useState(true);

  //const almRef = useRef<almBD | null>(null);

  const cancelarModal = () => {
    clearAsig();
    changeVisibilityAsig();
  };

  useEffect(() => {
    if (step > 5) {
      changeVisibilityAsig();
    }
  }, [step]);

  /* useEffect(() => {
    const obtenerAlmacenes = async () => {
      const peticion: almBD[] = await listarAlmacenes();

      almRef.current = peticion.find((pet) => pet.codigo == almDest) || null;

      setEsperando(false);
    };

    obtenerAlmacenes();
  }, []);

  if (esperando) {
    return null;
  } */

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
          <StepsAsig step={step} setStep={setStep} propAlm={almDest?.almacen} />
        </div>
      </motion.div>
    </div>
  );
}
