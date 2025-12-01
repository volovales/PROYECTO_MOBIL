export class Usuario {

    constructor(id, nombre, fechaCreacion) {
        this.id = id;                                  // Asigna el ID del usuario
        this.nombre = nombre;                          // Guarda el nombre del usuario
        this.fechaCreacion = fechaCreacion ||          // Si viene fecha de BD, úsala;
            new Date().toISOString();                  // si no, genera fecha actual automáticamente
    }

    static validar(nombre) {
        if (!nombre || nombre.trim().length == 0) {    // Verifica que el nombre NO esté vacío
            throw new Error('El nombre no puede estar vacio ');
        }

        if (nombre.length > 50) {                      // Verifica que el nombre no exceda 50 caracteres
            throw new Error('El nombre no puede tener más de 50 caracteres');
        }

        return true;                                   // Si pasa las validaciones, regresa true
    }
}
