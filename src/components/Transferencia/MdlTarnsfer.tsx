import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faBoxesStacked,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { TransferStore } from "../../stores/TransferStore";
import { useNavigate } from "react-router";
import { almBD } from "../../types";
import { listarAlmacenes } from "../../services/almacenService";

type Props = {
  changeVisibility: Function;
};

export default function MdlTarnsfer({ changeVisibility }: Props) {
  const almOrg = TransferStore((state) => state.almOrg);
  const setOrg = TransferStore((state) => state.setOrg);
  const setDest = TransferStore((state) => state.setDest);

  const [step, setStep] = useState(1);
  const [transition, setTransition] = useState(100);
  const [almacenesSal, setAlmacenesSal] = useState<almBD[]>([]);
  const [almacenesIng, setAlmacenesIng] = useState<almBD[]>([]);

  const navigate = useNavigate();

  const paneles = 2;

  /* const obtenerAlmacenes = async () => {
    const peticion = await listarAlmacenes();
    const almDefault = [
      { codigo: "ALPRTE", desc: "ALMACEN PRODUCTO TERMINADO", almacen: "" },
      {
        codigo: "ALTPPT",
        desc: "ALMACEN TEMP. PRODUCTO TERMINADO",
        almacen: "",
      },
    ];
    //console.log(peticion);
    const almSal = almDefault.concat(peticion);
    setAlmacenesSal(almSal);

    const almIng = almSal.filter(
      (alm) => alm.codigo != "ALPRTE" && alm.codigo != "ALTPPT"
    );
    setAlmacenesIng(almIng);
  }; */

  const obtenerAlmacenes = async () => {
    const peticion = await listarAlmacenes();

    const almSal: almBD[] = peticion;
    setAlmacenesSal(almSal);

    const almIng = almSal; //  almSal.filter((alm) => alm.almacen != "");
    setAlmacenesIng(almIng);
  };

  const nextStep = async (pasos: number = 1) => {
    setTransition(100);

    const next = step + pasos;
    if (next > paneles) {
      changeVisibility(false);
    }
    setStep(next);
  };

  const prevStep = () => {
    setTransition(-100);
    setStep(step - 1);
  };

  const asigOrg = (alm: almBD) => {
    setOrg(alm);
    nextStep();
  };

  const asigDest = (alm: almBD) => {
    setDest(alm);
    nextStep();
  };

  const cancelarModal = () => {
    changeVisibility(false);
    navigate("/");
  };

  useEffect(() => {
    obtenerAlmacenes();
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
            <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" />
            transferencia entre almacen
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
          {step > 1 && (
            <div className="">
              <button
                className=" py-2 rounded-md text-orange-500 uppercase text-sm md:text-base font-bold underline"
                onClick={prevStep}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft} className="me-2" />
                regresar
              </button>
            </div>
          )}

          {step === 1 && (
            <motion.div
              className=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [transition, 0] }}
              transition={{
                duration: 0.4,
                ease: "easeIn",
              }}
            >
              <p className="uppercase font-bold mb-2">
                seleccione almacen origen
              </p>
              <div className="flex gap-2 flex-wrap overflow-y-scroll max-h-[600px]">
                {almacenesSal.length > 0 &&
                  almacenesSal.map((alm) => (
                    <button
                      key={alm.codigo}
                      className="text-sm md:text-base border border-orange-500 rounded-md p-3 font-semibold text-orange-600 hover:bg-orange-500 hover:text-white w-full"
                      onClick={() => asigOrg(alm)}
                    >
                      {alm.desc}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              className=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [transition, 0] }}
              transition={{
                duration: 0.4,
                ease: "easeIn",
              }}
            >
              <p className="uppercase font-bold mb-2">
                seleccione almacen destino
              </p>
              <div className="flex gap-2 flex-wrap overflow-y-scroll max-h-[600px]">
                {almacenesIng.length > 0 &&
                  almacenesIng.map((alm) => {
                    if (alm.codigo !== almOrg?.codigo)
                      return (
                        <button
                          key={alm.codigo}
                          className="text-sm md:text-base border border-orange-500 rounded-md p-3 font-semibold text-orange-600 hover:bg-orange-500 hover:text-white w-full"
                          onClick={() => asigDest(alm)}
                        >
                          {alm.desc}
                        </button>
                      );
                  })}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
