export class Usuario {
    constructor (id, nombre, fechaCreacion) {
        this.id = id;
        this.nombre = nombre; 
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
    }

    //validaciones del modelo 
    static validar(nombre) {
        if (!nombre || nombre.trim().length== 0) {
            throw new Error ('El nombre no puede estar vacio ');
        }
        if (nombre.lenght > 50) {
            throw new Error ('El nombre no puede tener más de 50 caracteres');
        }
        return true;
    }
}