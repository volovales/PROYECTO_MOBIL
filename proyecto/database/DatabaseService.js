import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class DatabaseService {
  constructor() {
    this.db = null;
    this.storageKey = "usuarios";
  }

  async initialize() {
    if (Platform.OS === "web") {
      console.log("Usando LocalStorage (web)");
      return;
    }

    if (this.db) return;

    console.log("Usando SQLite (móvil)");
    this.db = await SQLite.openDatabaseAsync("miapp.db");

    // TABLA USUARIOS
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // TABLA TRANSACCIONES
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        descripcion TEXT,
        monto REAL NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // TABLA PRESUPUESTOS
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS presupuestos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT NOT NULL,
        limite REAL NOT NULL,
        gastado REAL DEFAULT 0
      );
    `);
  }

  // ───────── USUARIOS ─────────

  async getAll() {
    await this.initialize();

    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }

    return await this.db.getAllAsync("SELECT * FROM usuarios ORDER BY id DESC");
  }

  async registerUser(nombre, email, username, password) {
    await this.initialize();

    if (Platform.OS === "web") {
      const usuarios = await this.getAll();

      const exists = usuarios.find(
        (u) => u.email === email || u.username === username
      );
      if (exists) throw new Error("Datos duplicados");

      const nuevoUsuario = {
        id: Date.now(),
        nombre,
        email,
        username,
        password,
        fecha_creacion: new Date().toISOString(),
      };

      usuarios.unshift(nuevoUsuario);
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
      return nuevoUsuario;
    }

    try {
      const result = await this.db.runAsync(
        "INSERT INTO usuarios(nombre, email, username, password) VALUES (?, ?, ?, ?)",
        [nombre, email, username, password]
      );

      return {
        id: result.lastInsertRowId,
        nombre,
        email,
        username,
        password,
        fecha_creacion: new Date().toISOString(),
      };
    } catch (err) {
      throw new Error("Datos duplicados");
    }
  }

  async getUserEmailPassword(email, password) {
    await this.initialize();

    if (Platform.OS === "web") {
      const usuarios = await this.getAll();
      return (
        usuarios.find(
          (u) => u.email === email.trim() && u.password === password
        ) || null
      );
    }

    const rows = await this.db.getAllAsync(
      "SELECT * FROM usuarios WHERE email = ? AND password = ? LIMIT 1",
      [email.trim(), password]
    );
    return rows.length ? rows[0] : null;
  }

  async getUserByEmail(email) {
    await this.initialize();

    if (Platform.OS === "web") {
      const usuarios = await this.getAll();
      return usuarios.find((u) => u.email === email.trim()) || null;
    }

    const rows = await this.db.getAllAsync(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      [email.trim()]
    );
    return rows.length ? rows[0] : null;
  }

  // ───────── TRANSACCIONES ─────────

  async agregarTransaccion(tipo, descripcion, monto) {
    await this.initialize();
    return await this.db.runAsync(
      "INSERT INTO transacciones (tipo, descripcion, monto) VALUES (?, ?, ?)",
      [tipo, descripcion, monto]
    );
  }

  async obtenerTransacciones() {
    await this.initialize();
    return await this.db.getAllAsync(
      "SELECT * FROM transacciones ORDER BY fecha DESC"
    );
  }

  // ───────── PRESUPUESTOS ─────────

  async agregarPresupuesto(categoria, limite) {
    await this.initialize();
    return await this.db.runAsync(
      "INSERT INTO presupuestos (categoria, limite) VALUES (?, ?)",
      [categoria, limite]
    );
  }

  async obtenerPresupuestos() {
    await this.initialize();
    return await this.db.getAllAsync("SELECT * FROM presupuestos");
  }

  // ✏️ ***EDITAR presupuesto***  
  async editarPresupuesto(id, categoria, limite) {
    await this.initialize();
    return await this.db.runAsync(
      "UPDATE presupuestos SET categoria = ?, limite = ? WHERE id = ?",
      [categoria, limite, id]
    );
  }

  // 🗑️ ***ELIMINAR presupuesto***  
  async eliminarPresupuesto(id) {
    await this.initialize();
    return await this.db.runAsync(
      "DELETE FROM presupuestos WHERE id = ?",
      [id]
    );
  }

  // ───────── ESTADÍSTICAS ─────────

  async obtenerTotalIngresos() {
    await this.initialize();
    const r = await this.db.getFirstAsync(
      "SELECT SUM(monto) AS total FROM transacciones WHERE tipo='ingreso'"
    );
    return r?.total || 0;
  }

  async obtenerTotalGastos() {
    await this.initialize();
    const r = await this.db.getFirstAsync(
      "SELECT SUM(monto) AS total FROM transacciones WHERE tipo='gasto'"
    );
    return r?.total || 0;
  }
}

export default new DatabaseService();
