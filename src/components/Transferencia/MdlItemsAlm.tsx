import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTimes,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { TransferStore } from "../../stores/TransferStore";
import { ListarItemsDisp } from "../../services/almacenService";
import { useEffect, useState } from "react";
import { Infoarticulo } from "../../types";
import { aleatorioEntero } from "../../utils";
type Props = {
  changeVisiItems: Function;
};

type typeArtDisp = {
  codArt: string;
  descArt: string;
  saldo: string;
  pesoUnd: string;
  und: string;
};

export default function MdlItemsAlm({ changeVisiItems }: Props) {
  const almOrg = TransferStore((state) => state.almOrg);
  const setInfoArt = TransferStore((state) => state.setInfoArt);
  const setInfoDet = TransferStore((state) => state.setInfoDet);

  const [artDisp, setArtDisp] = useState([]);
  const [searchArt, setSearchArt] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Cálculo de los datos a mostrar

  const dataDisp =
    searchArt.length > 0
      ? artDisp.filter((art: typeArtDisp) => art["codArt"].includes(searchArt))
      : artDisp;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataDisp.slice(indexOfFirstItem, indexOfLastItem);

  // Cálculo del número total de páginas
  const totalPages = Math.ceil(dataDisp.length / itemsPerPage);

  // Cambio de página
  const handlePageChange = (numero: number) => {
    const pagina = currentPage + numero;
    setCurrentPage(pagina);
  };

  const buscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchArt(e.target.value.trim());
  };

  const addItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    /*   const visibles = currentItems.filter((art: typeArtDisp) =>
      art["codArt"].includes(searchArt)
    ); */
    if (e.key === "Enter" && dataDisp.length == 1) {
      asigItem(dataDisp[0]);
    }
  };

  const cancelarModal = () => {
    changeVisiItems();
  };

  const listarItems = async () => {
    const datos = {
      almacen: almOrg?.codigo || "",
      operacion: "listArtDisp",
    };

    const peticion = await ListarItemsDisp(datos);
    setArtDisp(peticion);
  };

  const asigItem = (datos: typeArtDisp) => {
    const dataArt: Infoarticulo = {
      codigo: datos.codArt,
      desc: datos.descArt,
      und: datos.und,
      sldoTotal: datos.saldo,
      pesoUnd: datos.pesoUnd,
    };

    const item = aleatorioEntero(200);

    const detalle = [
      {
        visible: true,
        codArt: datos.codArt,
        item: item,
        bultos: "",
        peso: "",
        lote: "",
        traza: "",
        adicional: "",
      },
    ];
    setInfoArt(dataArt);
    setInfoDet(detalle);
    changeVisiItems();
  };

  useEffect(() => {
    listarItems();
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
            <FontAwesomeIcon icon={faWarehouse} className="mr-2" />
            Articulos en Almacen
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
          <div className="w-full">
            <input
              type="text"
              className="h-8 border border-gray-300 rounded-lg px-2 mb-2 w-full"
              placeholder="CODIGO DEL ARTICULO"
              maxLength={11}
              onChange={buscar}
              value={searchArt}
              onKeyUp={addItem}
            />
          </div>
          <div className="w-full uppercase">
            <table className="w-full border-collapse border border-slate-400 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="border border-slate-400 p-1 bg-orange-500 font-bold text-white">
                    Articulo
                  </th>
                  <th className="border border-slate-400 p-1 bg-orange-500 font-bold text-white">
                    agregar
                  </th>
                </tr>
              </thead>
              <tbody>
                {artDisp &&
                  artDisp.length > 0 &&
                  currentItems.map((art: typeArtDisp) => {
                    return (
                      <tr key={art["codArt"]}>
                        <td className="border border-slate-400 p-2">
                          {art["descArt"]}
                        </td>
                        <td className="border border-slate-400 relative">
                          <button
                            className="w-full h-full bg-green-600 absolute top-0 left-0 text-white"
                            onClick={() => asigItem(art)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
