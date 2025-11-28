export class Transaccion {
    constructor(id, tipo, descripcion, monto, fecha) {
        this.id = id;
        this.tipo = tipo; // ingreso | gasto
        this.descripcion = descripcion;
        this.monto = monto;
        this.fecha = fecha;
    }

    static validar(tipo, monto) {
        if (!tipo || (tipo !== "ingreso" && tipo !== "gasto")) {
            throw new Error("El tipo debe ser ingreso o gasto");
        }

        if (!monto || isNaN(monto) || monto <= 0) {
            throw new Error("El monto debe ser un número mayor a 0");
        }

        return true;
    }
}
