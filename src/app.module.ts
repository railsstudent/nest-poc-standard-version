import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from '@/user'
import { ReportModule } from '@/report'
import { RepositoryModule } from '@/repositories'
import { getConnectionOptions } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...(await getConnectionOptions()),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    RepositoryModule,
    UserModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
