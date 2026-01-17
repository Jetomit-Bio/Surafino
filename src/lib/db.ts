import mariadb from "mariadb";

declare global {
  // eslint-disable-next-line no-var
  var mariadbPool: mariadb.Pool | undefined;
}

export const pool =
  global.mariadbPool ??
  mariadb.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    connectionLimit: 5,
    connectTimeout: 5000,
    acquireTimeout: 5000,
  });

if (!global.mariadbPool) {
  global.mariadbPool = pool;
}
