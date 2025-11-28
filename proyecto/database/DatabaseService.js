import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class DatabaseService {
  constructor() {
    this.db = null;
    this.storageKey = "usuarios";
  }

  async initialize() {
    if (Platform.OS === "web") {
      return;
    }
    if (this.db) {
      return;
    }
    this.db = await SQLite.openDatabaseAsync("miapp.db");
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
  }

  async getAll() {
    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } else {
      await this.initialize();
      return await this.db.getAllAsync(
        "SELECT * FROM usuarios ORDER BY id DESC"
      );
    }
  }

  async registerUser(nombre, email, username, password) {
    await this.initialize();

    if (Platform.OS === "web") {
      const usuarios = await this.getAll();

      const yaExiste = usuarios.find(
        (u) => u.email === email || u.username === username
      );
      if (yaExiste) {
        throw new Error("Datos duplicados");
      }

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
    } else {
      try {
        const result = await this.db.runAsync(
          "INSERT INTO usuarios(nombre, email, username, password) VALUES (?, ?, ?, ?);",
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
      } catch (error) {
        throw new Error("Datos duplicados");
      }
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
    } else {
      const rows = await this.db.getAllAsync(
        "SELECT * FROM usuarios WHERE email = ? AND password = ? LIMIT 1;",
        [email.trim(), password]
      );
      return rows.length > 0 ? rows[0] : null;
    }
  }

  async getUserByEmail(email) {
    await this.initialize();

    if (Platform.OS === "web") {
      const usuarios = await this.getAll();
      return usuarios.find((u) => u.email === email.trim()) || null;
    } else {
      const rows = await this.db.getAllAsync(
        "SELECT * FROM usuarios WHERE email = ? LIMIT 1;",
        [email.trim()]
      );
      return rows.length > 0 ? rows[0] : null;
    }
  }

  async add(nombre) {
    if (Platform.OS === "web") {
      const usuarios = await this.getAll();

      const nuevoUsuario = {
        id: Date.now(),
        nombre,
        fecha_creacion: new Date().toISOString(),
      };

      usuarios.unshift(nuevoUsuario);
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
      return nuevoUsuario;
    } else {
      await this.initialize();
      const result = await this.db.runAsync(
        "INSERT INTO usuarios(nombre) VALUES(?);",
        [nombre]
      );
      return {
        id: result.lastInsertRowId,
        nombre,
        fecha_creacion: new Date().toISOString(),
      };
    }
  }
}

export default new DatabaseService();
