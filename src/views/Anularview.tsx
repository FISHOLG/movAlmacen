import { useEffect, useState } from "react";
import { DetalleHistorial, HistorialTrans } from "../services/ValeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { SwAlert } from "../utils";
import { HistoryStore } from "../stores/HistoryStore";
import MdlDetVale from "../components/Historial/MdlDetVale";

export default function Anularview() {
  const numVale = HistoryStore((state) => state.numVale);
  const detalles = HistoryStore((state) => state.detalles);
  const setDetalles = HistoryStore((state) => state.setDetalles);
  const setNumVale = HistoryStore((state) => state.setNumVale);
  const clearAll = HistoryStore((state) => state.clearAll);

  const [pallet, setPallet] = useState("");
  const [alm, setAlm] = useState("");

  const [searching, setSearching] = useState(false);
  const [history, getHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Cálculo de los datos a mostrar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  // Cálculo del número total de páginas
  const totalPages = Math.ceil(history.length / itemsPerPage);

  // Cambio de página
  const handlePageChange = (numero: number) => {
    const pagina = currentPage + numero;
    setCurrentPage(pagina);
  };

  const llenarTabla = async () => {
    setSearching(true);
    const service = await HistorialTrans();

    getHistory(service);
    setSearching(false);
  };

  const ObtnerDetalle = async (
    numVale: string,
    pallet: string,
    almacen: string
  ) => {
    const datos = {
      operacion: "detHistory",
      numVale: numVale,
    };

    const peticion = await DetalleHistorial(datos);

    if (peticion.length === 0) {
      await SwAlert.fire({
        icon: "warning",
        text: "NO SE HAN ENCONTRADO DETALLES",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setPallet(pallet);
    setAlm(almacen);
    setNumVale(numVale);
    setDetalles(peticion);

    //console.log(peticion);
  };

  useEffect(() => {
    clearAll();
    llenarTabla();
  }, []);

  return (
    <>
      {numVale.length > 0 && detalles.length > 0 && (
        <MdlDetVale tOper="anular" tPallet={pallet} tAlmacen={alm} />
      )}
      <div id="controlPallet" className="px-2">
        <div className="pb-2">
          <h2 className="bg-red-600 text-white font-bold uppercase text-center text-base md:text-xl lg:text-2xl py-2">
            historial
          </h2>
        </div>

        <div className="pt-2">
          <table className="w-full border-collapse border border-slate-300 text-sm md:text-base">
            <thead>
              <tr className="text-center uppercase text-white bg-orange-600">
                <th className="border-collapse border border-slate-300 py-1 w-2/5">
                  # vale
                </th>
                <th className="border-collapse border border-slate-300 py-1 w-1/5">
                  Origen
                </th>
                <th className="border-collapse border border-slate-300 py-1 w-1/5">
                  Destino
                </th>
                <th className="border-collapse border border-slate-300 py-1 w-1/5">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {searching ? (
                <tr className="border-b-2 border-white  font-semibold ">
                  <td colSpan={5} className="py-2 text-center uppercase">
                    BUSCANDO...
                  </td>
                </tr>
              ) : history.length > 0 ? (
                currentItems.map((vale) => (
                  <tr
                    key={vale["nroVale"]}
                    className={`text-center`}
                    onClick={() =>
                      ObtnerDetalle(
                        vale["nroVale"],
                        vale["pallet"],
                        vale["camara"]
                      )
                    }
                  >
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["nroVale"]}
                    </td>

                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["almO"]}
                    </td>
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["almD"]}
                    </td>
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["fechaVale"]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b-2 border-slate-300  font-semibold ">
                  <td
                    colSpan={5}
                    className="border-collapse border border-slate-300 py-1 text-center"
                  >
                    NO SE HAN ENCONTRADO REGISTROS
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className=" flex justify-between  my-2">
            <div className="">
              <span>
                Pág {currentPage}/{totalPages}
              </span>
            </div>
            <div className="justify-end">
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
      </div>
    </>
  );
}
