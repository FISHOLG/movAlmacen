import {
  faBan,
  faBoxesStacked,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { HistoryStore } from "../../stores/HistoryStore";
import { SwAlert } from "../../utils";
import { useState } from "react";
import MdlAsigaRack from "./MdlAsigaRack";

type Props = {
  tOper?: string;
  tPallet?: string;
  tAlmacen?: string;
};

export default function MdlDetVale({ tOper, tPallet, tAlmacen }: Props) {
  const numVale = HistoryStore((state) => state.numVale);
  const detalles = HistoryStore((state) => state.detalles);
  const clearAll = HistoryStore((state) => state.clearAll);

  const [visiModal, setVisiModal] = useState(false);

  const changeVisibilityAsig = () => {
    setVisiModal(!visiModal);
  };

  const anularVale = async () => {
    const question = await SwAlert.fire({
      icon: "question",
      title: "¿ANULAR TRANSFERENCIA?",
      text: "Al realizar esta operación se anulara el vale y se procedera a ingresar una nueva ubicacion",
      showCancelButton: true,
      confirmButtonText: "CONTINUAR",
      cancelButtonText: "CANCELAR",
    });

    if (!question.isConfirmed) return;
    changeVisibilityAsig();
    // console.log(numVale, pallet, almacen);
  };

  return (
    <>
      {visiModal && (
        <MdlAsigaRack
          vale={numVale}
          pallet={tPallet ? tPallet : ""}
          camara={tAlmacen ? tAlmacen : ""}
          changeVisibilityAsig={changeVisibilityAsig}
        />
      )}
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
              vale: {numVale}
            </h3>
            <button
              className="px-5 text-lg text-gray-600 font-extrabold"
              onClick={() => clearAll()}
            >
              <FontAwesomeIcon icon={faTimes} size="xl" />
            </button>
          </div>
          {/* CARD BODY */}
          <div className="bg-white w-full p-3 text-sm md:text-base">
            <div className="flex flex-col">
              <p className="font-bold uppercase">observaciones</p>
              <textarea
                className="w-full h-12 p-2  border border-gray-300 rounded-md"
                readOnly
                value={detalles[0].obs}
              ></textarea>
            </div>
            <div className="my-2">
              <table>
                <thead>
                  <tr className="text-center uppercase text-white bg-orange-600">
                    <th className="border-collapse border border-slate-300 py-1 ">
                      código
                    </th>
                    <th className="border-collapse border border-slate-300 py-1 ">
                      articulo
                    </th>
                    <th className="border-collapse border border-slate-300 py-1 w-10">
                      KG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((det, index) => (
                    <tr className="text-center" key={index}>
                      <td className="border-collapse border border-slate-300 p-1">
                        {det.codigo}
                      </td>
                      <td className="border-collapse border border-slate-300 p-1">
                        {det.desc}
                      </td>
                      <td className="border-collapse border border-slate-300 p-1">
                        {det.cant}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {tOper && tOper === "anular" && tPallet && tAlmacen && (
            <div className="flex justify-end pb-3 pr-3">
              <button
                type="button"
                className="bg-red-600 text-white uppercase rounded-md w-32 p-2"
                onClick={anularVale}
              >
                <FontAwesomeIcon icon={faBan} /> anular
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
