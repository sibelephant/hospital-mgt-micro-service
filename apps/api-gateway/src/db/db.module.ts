import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createDb } from "@hospital/db";

export const DB = Symbol("DB");

@Global()
@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>("DATABASE_URL") ?? "postgres://hospital:hospital@localhost:5433/hospital";
        return createDb(url);
      }
    }
  ],
  exports: [DB]
})
export class DbModule {}
