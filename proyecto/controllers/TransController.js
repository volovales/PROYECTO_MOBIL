import DatabaseService from "../database/DatabaseService";
import { Transaccion } from "../model/Transaccion";

export class TransController {

    async agregar(tipo, descripcion, monto) {
        Transaccion.validar(tipo, monto);

        await DatabaseService.agregarTransaccion(tipo, descripcion, monto);
    }

    async obtener() {
        const data = await DatabaseService.obtenerTransacciones();
        return data.map(t => new Transaccion(t.id, t.tipo, t.descripcion, t.monto, t.fecha));
    }

    async totales() {
        const ingresos = await DatabaseService.obtenerTotalIngresos();
        const gastos = await DatabaseService.obtenerTotalGastos();
        return { ingresos, gastos };
    }
}
