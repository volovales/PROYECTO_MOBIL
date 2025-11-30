import DatabaseService from "../database/DatabaseService";
import { Presupuesto } from "../models/Presupuesto";

//controlador para manejar la logica del presupuesto
export class PresController {

    //crear un nuevo presupuesto
    async crear(categoria, limite) {

        const nombreFinal =
            categoria && categoria.trim().length > 0
                ? categoria.trim()
                : "Sin categoría";
        
        //valida si los datos son correctos tal y como se pide 
        Presupuesto.validar(nombreFinal, limite);

        await DatabaseService.agregarPresupuesto(nombreFinal, limite);
    }

    //Obtiene todos los presupuestos del usuario
    async obtenerTodos() {
        const data = await DatabaseService.obtenerPresupuestos();
        return data.map(
            (p) =>
                new Presupuesto(
                    p.id,
                    p.categoria,
                    p.limite,
                    p.gastado
                )
        );
    }
}
