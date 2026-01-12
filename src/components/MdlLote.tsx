import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons/faBoxesStacked";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GetLotes } from "../services/LoteService";
import { searchLote } from "../types";
import { SwAlert } from "../utils";
type Props = {
  changeVLote: Function;
  setLote: Function;
  articulo: string;
  almacen: string;
  tipoMov: string;
};
export default function MdlLote({
  changeVLote,
  setLote,
  articulo,
  almacen,
  tipoMov,
}: Props) {
  //const tipoMov = ValeStore((state) => state.tipoMov);

  const [lotes, setLotes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Cálculo de los datos a mostrar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lotes.slice(indexOfFirstItem, indexOfLastItem);

  // Cálculo del número total de páginas
  const totalPages = Math.ceil(lotes.length / itemsPerPage);

  // Cambio de página
  const handlePageChange = (numero: number) => {
    const pagina = currentPage + numero;
    setCurrentPage(pagina);
  };

  const selectLote = (nroLote: string) => {
    setLote(nroLote);
    changeVLote();
  };

  const cancelarModal = () => {
    changeVLote();
  };

  const obtenerLotes = async () => {
    let datos: searchLote = {
      operacion: "listarLotes",
      tMov: tipoMov,
    };
    if (tipoMov.substring(0, 1) === "S")
      datos = { ...datos, articulo, almacen };

    const peticion = await GetLotes(datos);

    if (peticion.result && peticion.result === "error") {
      await SwAlert.fire({
        icon: "warning",
        text: peticion.message,
        showConfirmButton: false,
        timer: 2500,
      });

      return;
    }
    setLotes(peticion);
  };

  useEffect(() => {
    obtenerLotes();
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
            <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" />
            seleccion n° lote
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
          <div className="w-full uppercase">
            <table className="w-full border-collapse border border-slate-400 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="border border-slate-400 p-1 bg-orange-500 font-bold text-white">
                    lote
                  </th>
                  <th className="border border-slate-400 p-1 bg-orange-500 font-bold text-white">
                    saldo
                  </th>
                </tr>
              </thead>
              <tbody>
                {lotes &&
                  lotes.length > 0 &&
                  currentItems.map((lot) => (
                    <tr
                      key={lot["codTempla"]}
                      onClick={() => selectLote(lot["codTempla"])}
                    >
                      <td className="border border-slate-400 p-2">
                        {lot["codTempla"]}
                      </td>
                      <td className="border border-slate-400 relative p-2">
                        {lot["saldo"]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className=" flex justify-end my-2">
              {currentPage > 1 && (
                <button
                  type="button"
                  className={`mx-1 px-3 py-1 rounded bg-sky-600 text-white`}
                  onClick={() => handlePageChange(-1)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  type="button"
                  className={`mx-1 px-3 py-1 rounded bg-orange-600 text-white`}
                  onClick={() => handlePageChange(1)}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
