import { useForm } from "react-hook-form";
import { TransferPStore } from "../../stores/TranPalletStore";
import { formatearNumero, loadingSave, SwAlert } from "../../utils";
import { useEffect, useState } from "react";
import { dataFormTransP, dataItemTransP } from "../../types/index";
import DetTarnsP from "./DetTarnsP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { AuthStore } from "../../stores/AuthStore";
import { TrasladarPallet } from "../../services/PalletService";
import { useNavigate } from "react-router";
import MdlMultEtiqueta from "./MdlMultEtiqueta";

type formSearch = {
  qr: string;
};

export default function FormTranserP() {
  const infoPalletO = TransferPStore((state) => state.infoPalletO);
  const infoPalletD = TransferPStore((state) => state.infoPalletD);
  const infoDet = TransferPStore((state) => state.infoDet);
  const infoArt = TransferPStore((state) => state.infoArt);
  const dropAll = TransferPStore((state) => state.dropAll);

  const auth = AuthStore((state) => state.auth);

  const [dataTrans, setDataTrans] = useState<dataItemTransP[]>([]);

  const navigate = useNavigate();

  // Formulario de Busqueda
  const {
    register: registerFormSearch,
    handleSubmit: handleSubmitSearch,
    reset: resetSearch,
    // formState: { errors: errorsSearch },
    setFocus,
    setValue: setValueSearch,
  } = useForm<formSearch>();

  const {
    // register: registerFormTrans,
    handleSubmit: handleSubmitFormTran,
    //reset: resetTrans,
    setValue: setValTrans,
    control,
  } = useForm<dataFormTransP>();

  const [multItem, setMultItem] = useState(false);
  const [saldo, setSaldo] = useState(false);
  const [permitirSaldo, setPermitirSaldo] = useState(true);
  const [contEtiqueta, setContEtiqueta] = useState(1);
  const [mdlEtiquetas, setMdlEtiqueta] = useState(false);

  const toggleSwitch = () => {
    setMultItem(true);
  };

  const toggleSwitchSaldo = () => {
    setSaldo(!saldo);
  };

  const asignarNumEtiquetas = (numero: number) => {
    setContEtiqueta(numero);
    setMdlEtiqueta(false);
  };

  const addDetalle = (data: dataItemTransP) => {
    const search = dataTrans.find(
      (det) =>
        det.traza === data.traza &&
        det.lote == data.lote &&
        det.codArt === data.codArt
      //  && det.ot == data.ot
    );

    if (search === undefined) {
      const dataAdd = {
        ...data,
        peso: multItem
          ? data.peso
          : saldo
          ? data.adicional
          : data.pesoUnd
          ? data.pesoUnd.toString()
          : "1",
        //bultos: "1",
      };

      setDataTrans((prevItems) => [...prevItems, dataAdd]);
    } else {
      const PesoItem = parseFloat(
        multItem
          ? data.peso
          : saldo
          ? data.adicional
          : data.pesoUnd
          ? data.pesoUnd.toString()
          : "1"
      );
      const peso = parseFloat(search.peso) + PesoItem;

      // const bultos = peso / PesoItem;

      setDataTrans((prevItems) =>
        prevItems.map((item) =>
          item.traza === search.traza &&
          item.lote == search.lote &&
          item.codArt === search.codArt
            ? // && item.ot == search.ot
              {
                ...item,
                peso: formatearNumero(peso),
                //  bultos: bultos.toString(),
              }
            : item
        )
      );
    }
  };

  const submitSearch = async (data: formSearch) => {
    if (!infoDet) return;
    const dataQr = data.qr.split("|");
    //const ot = dataQr[1];
    //const fecha = formatearFecha(dataQr[2]);
    const traza = dataQr[3];
    const lote = dataQr[4];

    const codArti = dataQr[0];
    const arrayArti = infoDet.find((obj) => obj[codArti]);
    if (!arrayArti) return;
    const items = arrayArti[codArti];

    let search: dataItemTransP[] = [];

    if (contEtiqueta === 1 && !saldo && items) {
      search = items.filter(
        (info) => info.traza == traza && info.lote == lote  &&  parseFloat (info.peso )>0
        //&& info.ot == ot
      );
    } else if (contEtiqueta > 1 && items) {
      search = items.filter(
        (info) =>
          (info.traza.split("|").length == contEtiqueta ||
            (info.traza.split("|").length == 1 &&
              parseFloat(info.peso) <
                parseFloat(infoArt ? infoArt.pesoUnd : "1"))) &&
          info.traza.split("|").includes(traza) &&
          info.lote.split("|").includes(lote)
        //  && info.ot.split("|").includes(ot)
      );
    } else if (saldo && items) {
      search = items.filter(
        (info) =>
          parseFloat(info.adicional) > 0 &&
          info.peso === "0" &&
          info.traza.split("|").includes(traza) &&
          info.lote.split("|").includes(lote)
        //  && info.ot.split("|").includes(ot)
      );
    }

    if (search.length == 0) {
      await SwAlert.fire({
        icon: "warning",
        text: "NO SE HA ENCONTRADO ITEM",
        showConfirmButton: false,
        timer: 2500,
      });
      setValueSearch("qr", "");
      return;
    }

    const objetos = createObjects({ ...search[0] });
    objetos.forEach((element) => {
      addDetalle(element);
    });
    if (multItem) {
      const count =
        contEtiqueta - objetos.length === 0 ? 1 : contEtiqueta - objetos.length;

      setContEtiqueta(count);
    }

    if (saldo) {
      setSaldo(false);
      setPermitirSaldo(false);
    }

    resetSearch();
  };
  function createObjects(data: dataItemTransP): dataItemTransP[] {
    const keys: (keyof dataItemTransP)[] = Object.keys(
      data
    ) as (keyof dataItemTransP)[];

    // Dividir cada propiedad por '|'
    const splitValues = keys.reduce((acc, key) => {
      acc[key] = data[key].split("|");
      return acc;
    }, {} as Record<keyof dataItemTransP, string[]>);

    // Determinar cuántos objetos crear (tomamos el número de elementos en el primer array)
    const numberOfObjects = splitValues[keys[0]].length;

    // Crear los objetos combinando los valores
    const objects: dataItemTransP[] = [];
    for (let i = 0; i < numberOfObjects; i++) {
      const obj: dataItemTransP = {} as dataItemTransP;
      keys.forEach((key) => {
        obj[key] = splitValues[key][i];
      });
      objects.push(obj);
    }

    return objects;
  }

  const enviarForm = async (datos: dataFormTransP) => {
    try {
      const datosForm = datos.detalles;

      const dataDet = datosForm.map((det) => {
        return {
          ot: det.referencia ? det.referencia.nro : "",
          traza: det.traza,
          peso: det.peso,
          // articulo: infoArt ? infoArt.codigo : "",
          articulo: det.codArt,
        };
      });

      const dataSubmit = {
        palletO: infoPalletO,
        palletD: infoPalletD,
        usuario: auth.usuario,
        detalle: dataDet,
        operacion: "traslado",
        //  articulo: infoArt ? infoArt.codigo : "",
      };

      const saveAlert = await SwAlert.fire({
        title: "¿GUARDAR?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "CONFIRMAR",
        cancelButtonText: "CANCELAR",
      });
      if (!saveAlert.isConfirmed) return;

      loadingSave();

      const peticion = await TrasladarPallet(dataSubmit);

      if (!peticion.result) {
        return await SwAlert.fire({
          icon: "error",
          title: "NO SE HA REALIZADO LA OPERACIÓN",
          text: "ERROR DESCONOCIDO",
          showConfirmButton: false,
          timer: 2500,
        });
      }

      if (peticion.result == "error") {
        return await SwAlert.fire({
          icon: "error",
          title: "ERROR AL TRANSFERIR",
          text: peticion["message"],
          showConfirmButton: false,
          timer: 2500,
        });
      }

      await SwAlert.fire({
        icon: "success",
        title: "OPERACIÓN EXITOSA",
        text: "TRANSFERENCIA SE REALIZÓ CORRECTAMENTE",
        showConfirmButton: true,
        confirmButtonText: "CONTINUAR",
      });

      retornar();
    } catch (error: any) {
      SwAlert.fire({
        icon: "error",
        title: "ERROR AL TRANSFERIR",
        text: error.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const recuperarFoco = () => {
    if (!mdlEtiquetas) setFocus("qr");
  };

  const retornar = () => {
    dropAll();
    navigate("/");
  };

  useEffect(() => {
    recuperarFoco();
  }, []);

  useEffect(() => {
    if (multItem) {
      setMdlEtiqueta(true);
    }
  }, [multItem]);

  useEffect(() => {
    if (!mdlEtiquetas) {
      recuperarFoco();
    }
  }, [mdlEtiquetas]);

  useEffect(() => {
    if (contEtiqueta === 1) {
      setMultItem(false);
    }
  }, [contEtiqueta]);

  return (
    <>
      {mdlEtiquetas && (
        <MdlMultEtiqueta asignarNumEtiquetas={asignarNumEtiquetas} />
      )}
      <div className="px-2">
        <div className="pb-2">
          <h2 className="bg-red-600 text-white font-bold uppercase text-center text-base md:text-xl lg:text-2xl py-2">
            transf. entre pallet
          </h2>
        </div>

        <div className="flex gap-2 text-sm md:text-base flex-wrap justify-between">
          <div className="">
            <p className="uppercase font-semibold">pallet origen</p>
            <input
              type="text"
              className="h-8 px-2 border border-gray-300 rounded-lg uppercase text-center"
              readOnly
              value={infoPalletO}
            />
          </div>
          <div className="">
            <p className="uppercase font-semibold">pallet destino</p>
            <input
              type="text"
              className="h-8 px-2 border border-gray-300 rounded-lg uppercase text-center"
              readOnly
              value={infoPalletD}
            />
          </div>
        </div>
        <div className="flex justify-center gap-x-10">
          {/* BOTON DE MULT ETIQUETA */}
          <div className="">
            <span className="uppercase text-xs md:text-base block text-center py-2 font-semibold">
              activar para caja multiple etiquetas
            </span>
            <div className="flex justify-center">
              <button
                onClick={toggleSwitch}
                disabled={saldo}
                className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-300 ${
                  multItem ? "bg-orange-600" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${
                    multItem ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>

              <span className="ml-2 text-gray-700">
                {contEtiqueta > 1 ? `# Etiquetas: ${contEtiqueta}` : ""}
              </span>
            </div>
          </div>
          {/* BOTON DE SALDO */}
          <div className="">
            <span className="uppercase text-xs md:text-base block text-center py-2 font-semibold">
              activar para obtener el saldo
            </span>
            <div className="flex justify-center">
              <button
                onClick={toggleSwitchSaldo}
                disabled={multItem || !permitirSaldo}
                className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-300 ${
                  saldo ? "bg-orange-600" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${
                    saldo ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmitSearch(submitSearch)} autoComplete="off">
          <div className="flex my-2">
            <input
              type="text"
              className="h-8 px-2 border border-gray-300 rounded-lg uppercase text-center w-full caret-transparent"
              {...registerFormSearch("qr")}
              onBlur={recuperarFoco}
              onInput={(e) => setValueSearch("qr", e.currentTarget.value)}
            />
          </div>
        </form>

        <form onSubmit={handleSubmitFormTran(enviarForm)}>
          {dataTrans.length > 0 &&
            dataTrans.map((data, index) => (
              <DetTarnsP
                key={index}
                detalle={data}
                index={index}
                control={control}
                setValue={setValTrans}
              />
            ))}
          {dataTrans.length > 0 && (
            <div className="flex py-3">
              <button
                type="button"
                className="w-1/2 text-white text-center bg-red-600 py-2 rounded-l-md"
                onClick={retornar}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <button
                type="submit"
                className="w-1/2 text-white text-center bg-sky-600 py-2 rounded-r-md"
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
