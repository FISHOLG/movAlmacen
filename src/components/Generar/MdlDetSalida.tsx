import {
  faBoxesStacked,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { ValeStore } from "../../stores/ValeStore";

type Props = {
  changeVMdlSalida: Function;
};

export default function MdlDetSalida({ changeVMdlSalida }: Props) {
  const infoArt = ValeStore((state) => state.infoArt);
  const infoDet = ValeStore((state) => state.infoDet);
  const changeVDet = ValeStore((state) => state.changeVDet);

  const agregarItem = (item: string, pallet: string) => {
    changeVDet(item, pallet);
    changeVMdlSalida();
  };

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
            Articulos en Almacen
          </h3>
          <button
            className="px-5 text-lg text-gray-600 font-extrabold"
            onClick={() => changeVMdlSalida()}
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
                    articulo
                  </th>
                  <th className="border border-slate-400 p-1 bg-orange-500 font-bold text-white">
                    agregar
                  </th>
                </tr>
              </thead>
              <tbody>
                {infoDet &&
                  infoDet.length > 0 &&
                  infoDet.map(
                    (det) =>
                      !det.visible && (
                        <tr>
                          <td className="border border-slate-400 p-1">{`(${det.fecha}) ${infoArt?.desc} (${det.peso})`}</td>
                          <td className="border border-slate-400 relative">
                            <button
                              className="w-full h-full bg-green-600 absolute top-0 left-0 text-white"
                              onClick={() =>
                                agregarItem(
                                  det.item,
                                  det.numPallet ? det.numPallet : ""
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
