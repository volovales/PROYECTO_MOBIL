export class Presupuesto {
    constructor(id, categoria, limite, gastado) {
        this.id = id;
        this.categoria = categoria;
        this.limite = limite;
        this.gastado = gastado;
    }

    static validar(categoria, limite) {
        if (!categoria || categoria.trim().length === 0)
            throw new Error("La categoría no puede estar vacía");

        if (!limite || isNaN(limite) || limite <= 0)
            throw new Error("El límite debe ser mayor a 0");

        return true;
    }
}
