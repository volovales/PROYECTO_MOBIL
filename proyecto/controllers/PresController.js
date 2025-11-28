import DatabaseService from "../database/DatabaseService";
import { Presupuesto } from "../models/Presupuesto";

export class PresController {

    async crear(categoria, limite) {
        if (!categoria) throw new Error("La categoría no puede estar vacía");
        if (limite <= 0) throw new Error("El límite debe ser mayor a 0");

        await DatabaseService.agregarPresupuesto(categoria, limite);
    }

    async obtenerTodos() {
        const data = await DatabaseService.obtenerPresupuestos();
        return data.map(p => new Presupuesto(
            p.id, p.categoria, p.limite, p.gastado
        ));
    }
}
