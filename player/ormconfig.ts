const DEFAULT_SETTINGS = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD || "postgres",
  logging: false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [
    `src/entity/**/*.ts`
  ],
  migrations: [
    `src/database/migration/**/*.ts`
  ],
  cli: {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/database/migration",
  },
};

export default [
  {
    ...DEFAULT_SETTINGS,
    name: "development",
    database: process.env.POSTGRES_DB || "node_project",
    synchronize: false,
  },
  {
    ...DEFAULT_SETTINGS,
    name: "test",
    dropSchema: true,
    database: process.env.POSTGRES_TEST_DB,
    synchronize: true
  }
];