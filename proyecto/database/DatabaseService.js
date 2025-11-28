import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {

        if (Platform.OS === 'web') {
            console.log("Usando LocalStorage (web)");
            return;
        }

        console.log("Usando SQLite (móvil)");

        this.db = await SQLite.openDatabaseAsync("miapp.db");

        // TABLA TRANSACCIONES
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS transacciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,            -- ingreso | gasto
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

    // ========== TRANSACCIONES ==========
    async agregarTransaccion(tipo, descripcion, monto) {
        return await this.db.runAsync(
            "INSERT INTO transacciones (tipo, descripcion, monto) VALUES (?, ?, ?)",
            tipo, descripcion, monto
        );
    }

    async obtenerTransacciones() {
        return await this.db.getAllAsync(
            "SELECT * FROM transacciones ORDER BY fecha DESC"
        );
    }

    // ========== PRESUPUESTOS ==========
    async agregarPresupuesto(categoria, limite) {
        return await this.db.runAsync(
            "INSERT INTO presupuestos (categoria, limite) VALUES (?, ?)",
            categoria, limite
        );
    }

    async obtenerPresupuestos() {
        return await this.db.getAllAsync(
            "SELECT * FROM presupuestos"
        );
    }

    // ========== DATOS PARA GRÁFICAS ==========
    async obtenerTotalIngresos() {
        const result = await this.db.getFirstAsync(
            "SELECT SUM(monto) as total FROM transacciones WHERE tipo='ingreso'"
        );
        return result.total || 0;
    }

    async obtenerTotalGastos() {
        const result = await this.db.getFirstAsync(
            "SELECT SUM(monto) as total FROM transacciones WHERE tipo='gasto'"
        );
        return result.total || 0;
    }
}

export default new DatabaseService();