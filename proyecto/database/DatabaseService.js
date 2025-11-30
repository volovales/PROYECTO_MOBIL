import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class DatabaseService {
  constructor() {
    this.db = null;
    this.currentUserId = null;

    this.storageKeyUsers = "usuarios";
    this.storageKeyTrans = "transacciones";
    this.storageKeyPres = "presupuestos";
  }

  //  Helpers  para la fecha de méxico, con el formato actual
  getNowMexicoDateTime() {
    try {
      const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const parts = formatter.formatToParts(new Date());
      const map = {};
      parts.forEach((p) => {
        map[p.type] = p.value;
      });

      // Formato: 2025-11-30T14:23:45
      return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
    } catch (e) {
      // Fallback por si algo falla con Intl
      return new Date().toISOString();
    }
  }

  getNowMexicoDate() {
    // regresa solo la parte de fecha: 2025-11-30
    return this.getNowMexicoDateTime().split("T")[0];
  }

  
  setCurrentUser(user) {
    this.currentUserId = user ? user.id : null;
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  async initialize() {
    if (Platform.OS === "web") return;
    if (this.db) return;

    this.db = await SQLite.openDatabaseAsync("miapp.db");

    await this.db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fecha_creacion TEXT
      );

      CREATE TABLE IF NOT EXISTS presupuesto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT NOT NULL,
        limite REAL NOT NULL,
        fecha TEXT,
        user_id INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        descripcion TEXT,
        monto REAL NOT NULL,
        fecha TEXT,
        user_id INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `);
  }


  // Parte de los USUARIOS

  //obtiene todos los usuarios registrados en la BD
  async getAll() {
    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.storageKeyUsers);
      return data ? JSON.parse(data) : [];
    }

    await this.initialize();
    return await this.db.getAllAsync("SELECT * FROM usuarios ORDER BY id DESC;");
  }

  //registrar nuevo usuario
  async registerUser(nombre, email, username, password) {
    await this.initialize();
    const fechaMX = this.getNowMexicoDateTime();

    if (Platform.OS === "web") {
      const lista = await this.getAll();

      //confirma y verifica si estan duplicados
      const existe = lista.find(
        (u) => u.email === email || u.username === username
      );

      if (existe) throw new Error("Datos duplicados");

      const nuevo = {
        id: Date.now(),
        nombre,
        email,
        username,
        password,
        fecha_creacion: fechaMX,
      };

      lista.unshift(nuevo);
      localStorage.setItem(this.storageKeyUsers, JSON.stringify(lista));
      return nuevo;
    }

    try {
      const result = await this.db.runAsync(
        "INSERT INTO usuarios(nombre, email, username, password, fecha_creacion) VALUES (?, ?, ?, ?, ?);",
        [nombre, email, username, password, fechaMX]
      );

      return {
        id: result.lastInsertRowId,
        nombre,
        email,
        username,
        password,
        fecha_creacion: fechaMX,
      };
    } catch (error) {
      //error si algo esta repetido el user o el email
      throw new Error("Datos duplicados");
    }
  }

  //buscar el usuario por el email y contraseña
  async getUserEmailPassword(email, password) {
    await this.initialize();

    if (Platform.OS === "web") {
      const lista = await this.getAll();
      return (
        lista.find(
          (u) => u.email === email.trim() && u.password === password
        ) || null
      );
    }

    const rows = await this.db.getAllAsync(
      "SELECT * FROM usuarios WHERE email = ? AND password = ? LIMIT 1;",
      [email.trim(), password]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  //buscar el usuario por el email
  async getUserByEmail(email) {
    await this.initialize();

    if (Platform.OS === "web") {
      const lista = await this.getAll();
      return lista.find((u) => u.email === email.trim()) || null;
    }

    const rows = await this.db.getAllAsync(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1;",
      [email.trim()]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  //actualiza la contraseña con el email
  async updateUserPasswordByEmail(email, pass) {
    await this.initialize();

    return await this.db.runAsync(
      "UPDATE usuarios SET password = ? WHERE email = ?;",
      [pass, email.trim()]
    );
  }


  // Parte de PRESUPUESTOS


  async obtenerPresupuestos() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];

    await this.initialize();

    return await this.db.getAllAsync(
      "SELECT * FROM presupuesto WHERE user_id = ? ORDER BY id DESC;",
      [userId]
    );
  }

  //agregar el presupuesto
  async agregarPresupuesto(categoria, limite, fecha) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error("Sin usuario activo");

    await this.initialize();

    const fechaFinal = fecha || this.getNowMexicoDate(); // YYYY-MM-DD

    const result = await this.db.runAsync(
      "INSERT INTO presupuesto(categoria, limite, fecha, user_id) VALUES (?, ?, ?, ?);",
      [categoria, limite, fechaFinal, userId]
    );

    return {
      id: result.lastInsertRowId,
      categoria,
      limite,
      fecha: fechaFinal,
      user_id: userId,
    };
  }

  //editar el presupuesto
  async editarPresupuesto(id, categoria, limite, fecha) {
    await this.initialize();

    const fechaFinal = fecha || this.getNowMexicoDate();

    return await this.db.runAsync(
      "UPDATE presupuesto SET categoria = ?, limite = ?, fecha = ? WHERE id = ?;",
      [categoria, limite, fechaFinal, id]
    );
  }

  //eliminar el presupuesto
  async eliminarPresupuesto(id) {
    await this.initialize();

    return await this.db.runAsync("DELETE FROM presupuesto WHERE id = ?;", [id]);
  }


  // Parte de las TRANSACCIONES

  //obtener todas las transacciones del usuario que inicio sesion
  async obtenerTransacciones() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];

    await this.initialize();

    return await this.db.getAllAsync(
      "SELECT * FROM transacciones WHERE user_id = ? ORDER BY id DESC;",
      [userId]
    );
  }

  //agregar alguna transaccion
  async agregarTransaccion(tipo, descripcion, monto) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error("Sin usuario activo");

    await this.initialize();

    const fechaFinal = this.getNowMexicoDateTime(); // YYYY-MM-DDTHH:mm:ss

    const result = await this.db.runAsync(
      `INSERT INTO transacciones(tipo, descripcion, monto, fecha, user_id)
       VALUES (?, ?, ?, ?, ?);`,
      [tipo, descripcion, monto, fechaFinal, userId]
    );

    return {
      id: result.lastInsertRowId,
      tipo,
      descripcion,
      monto,
      fecha: fechaFinal,
      user_id: userId,
    };
  }

  //editar la transaccion
  async editarTransaccion(id, tipo, descripcion, monto, fecha) {
    await this.initialize();

    const fechaFinal = fecha || this.getNowMexicoDateTime();

    return await this.db.runAsync(
      `UPDATE transacciones 
       SET tipo = ?, descripcion = ?, monto = ?, fecha = ?
       WHERE id = ?;`,
      [tipo, descripcion, monto, fechaFinal, id]
    );
  }

  //eliminar alguna transaccion
  async eliminarTransaccion(id) {
    await this.initialize();

    return await this.db.runAsync("DELETE FROM transacciones WHERE id = ?;", [
      id,
    ]);
  }

  //obtener todo el total de los ingresos
  async obtenerTotalIngresos() {
    const userId = this.getCurrentUserId();
    if (!userId) return 0;

    await this.initialize();

    const rows = await this.db.getAllAsync(
      `SELECT SUM(monto) AS total FROM transacciones 
       WHERE user_id = ? AND tipo = 'ingreso';`,
      [userId]
    );

    return rows[0]?.total ? Number(rows[0].total) : 0;
  }

  //obtener todo el total de los gastos
  async obtenerTotalGastos() {
    const userId = this.getCurrentUserId();
    if (!userId) return 0;

    await this.initialize();

    const rows = await this.db.getAllAsync(
      `SELECT SUM(monto) AS total FROM transacciones 
       WHERE user_id = ? AND tipo = 'gasto';`,
      [userId]
    );

    return rows[0]?.total ? Number(rows[0].total) : 0;
  }
}

export default new DatabaseService();
