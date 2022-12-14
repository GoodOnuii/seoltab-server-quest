import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { BoardService } from './board/board.service';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
import { AppResolver } from './app/app.resolver';
import { AppService } from './app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './shared/util/typeOrmConfig';
import { ApolloDriver } from '@nestjs/apollo'

@Module({
  imports: [
    UserModule,
    BoardModule,
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      ...typeormConfig,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: () => {
        const schemaModuleOptions: Partial<GqlModuleOptions> = {};

        // If we are in development, we want to generate the schema.graphql
        if (process.env.NODE_ENV !== 'production' || process.env.IS_OFFLINE) {
          schemaModuleOptions.autoSchemaFile = 'schema.graphql';
        } else {
          // For production, the file should be generated
          schemaModuleOptions.typePaths = ['dist/schema.graphql'];
        }

        return {
          context: ({ req }) => ({ req }),
          playground: true, // Allow playground in production
          introspection: true, // Allow introspection in production
          ...schemaModuleOptions,
        };
      },
    }),
  ],
  providers: [AppService, BoardService, AppResolver],
})
export class AppModule {}
