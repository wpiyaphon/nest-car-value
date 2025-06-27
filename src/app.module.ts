import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieSession from 'cookie-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from './data-source';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     const env = config.get('NODE_ENV');
    //     if (env === 'development') {
    //       return AppDataSource.options;
    //     }

    //     if (env === 'test') {
    //       return {
    //         type: 'sqlite',
    //         database: config.get<string>('DB_NAME'),
    //         entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
    //         migrationsRun: true,
    //       };
    //     }

    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       autoLoadEntities: true,
    //     };
    //   },
    // }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY') || ''],
        }),
      )
      .forRoutes('*');
  }
}
