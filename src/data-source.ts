import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig: TypeOrmModuleOptions = {
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
    } as TypeOrmModuleOptions);
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      migrationsRun: true,
    } as TypeOrmModuleOptions);
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    } as TypeOrmModuleOptions);
    break;
  default:
    throw new Error('unknown environment');
}

export const AppDataSource = new DataSource(dbConfig as DataSourceOptions);
