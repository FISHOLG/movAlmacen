
import Cliente from "./Cliente";

const DesencriptarCodigo = async (
    codigoQR: string,

) => {
    try {

        const datos = {

            operacion: "decrypt",
            qrEncrypted: codigoQR,

        };

        const url = `/api/general`;
        const peticion = await Cliente.post(url, datos);

        return peticion.data;
    } catch (error: any) {}
};

export { DesencriptarCodigo };
