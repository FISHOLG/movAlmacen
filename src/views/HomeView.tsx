import {
  faArrowRightArrowLeft,
  faBan,
  faCartFlatbed,
  faClipboardList,
  faEye,
  faReceipt,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import OptionButton from "../components/Home/OptionButton";

export default function HomeView() {
  return (
    <>
      <div className="flex flex-wrap gap-2 px-2">
        <OptionButton titulo="generar vale" icon={faReceipt} view="generar" />
        <OptionButton
          titulo="transferencia entre almacen"
          icon={faWarehouse}
          view="transferencia"
        />
        <OptionButton
          titulo="asignar ubicacion pallet"
          icon={faCartFlatbed}
          view="ubicacion"
        />
        <OptionButton
          titulo="transf. entre pallet"
          icon={faArrowRightArrowLeft}
          view="transpallet"
        />
        <OptionButton
          titulo="historial de vales"
          icon={faClipboardList}
          view="historial"
        />
         <OptionButton
          titulo="Detalle Pallet"
          icon={faEye}
          view="detallePallet"
        />
        <OptionButton
          titulo="Anular Transferencia"
          icon={faBan}
          view="anular"
        />
      </div>
    </>
  );
}
