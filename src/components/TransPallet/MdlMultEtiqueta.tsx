import { faQrcode, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  asignarNumEtiquetas: Function;
};

export default function MdlMultEtiqueta({ asignarNumEtiquetas }: Props) {
  const refCount = useRef<HTMLInputElement>(null);

  const asignar = () => {
    const cont = refCount.current?.value;
    asignarNumEtiquetas(cont);
  };

  useEffect(() => {
    if (refCount.current) refCount.current.focus();
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
            BUlto multiple etiqueta
          </h3>
          <button
            className="px-5 text-lg text-gray-600 font-extrabold"
            // onClick={cancelarModal}
          >
            <FontAwesomeIcon icon={faTimes} size="xl" />
          </button>
        </div>
        {/* CARD BODY */}
        <div className="bg-white w-full p-3 gap-y-2 flex flex-col">
          <h3 className="uppercase font-bold">Ingrese Numero de Etiquetas</h3>
          <div className="flex gap-x-2">
            <input
              defaultValue={2}
              ref={refCount}
              type="number"
              className="h-10 px-2 border border-gray-300 rounded-lg w-full"
              step={1}
              onBlur={() => refCount.current?.focus()}
            />
            <button
              className="w-32 bg-orange-600 text-white rounded-lg"
              onClick={asignar}
            >
              Confirmar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
