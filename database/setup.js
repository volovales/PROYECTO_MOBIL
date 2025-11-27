import { executeSql } from 'C:/Users/Win11/OneDrive/Documentos/GitHub/PROYECTO_MOBIL/database';

export const setupDatabase = async () => {
  await executeSql(`
    CREATE TABLE IF NOT EXISTS presupuestos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      monto REAL NOT NULL
    );
  `);
};
