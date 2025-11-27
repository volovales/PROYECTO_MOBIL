import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Proyecto.db');

export const executeSql = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export default db;
