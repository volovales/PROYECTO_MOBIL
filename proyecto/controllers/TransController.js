import DatabaseService from "../database/DatabaseService";
import { Transaccion } from "../models/Transaccion";

export class TransController {
  // Crear transacción (ingreso / gasto)
  async agregar(tipo, descripcion, monto) {
    Transaccion.validar(tipo, monto);
    await DatabaseService.agregarTransaccion(tipo, descripcion, monto);
  }

  // Editar transacción existente
  async editar(id, tipo, descripcion, monto, fecha) {
    Transaccion.validar(tipo, monto);
    await DatabaseService.editarTransaccion(id, tipo, descripcion, monto, fecha);
  }

  // Eliminar transacción
  async eliminar(id) {
    await DatabaseService.eliminarTransaccion(id);
  }

  // Obtener todas las transacciones del usuario actual
  async obtener() {
    const data = await DatabaseService.obtenerTransacciones();
    return data.map(
      (t) => new Transaccion(t.id, t.tipo, t.descripcion, t.monto, t.fecha)
    );
  }

  // Totales de ingresos y gastos
  async totales() {
    const ingresos = await DatabaseService.obtenerTotalIngresos();
    const gastos = await DatabaseService.obtenerTotalGastos();
    return { ingresos, gastos };
  }
}
