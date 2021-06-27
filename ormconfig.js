module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  entities: [__dirname + '/dist/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/dist/migrations/**/*.js'],
  synchronize: false,
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
  },
}
