import "reflect-metadata";
import { dataSource } from "./db";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AdsResolver } from "./resolvers/Ads";
import { CategoriesResolver } from "./resolvers/Categories";
import { TagsResolver } from "./resolvers/Tags";

const initialize = async () => {
    await dataSource.initialize();
    console.log("DataSource is connected");

    const schema = await buildSchema({
        resolvers: [AdsResolver, CategoriesResolver, TagsResolver],
    });

    const server = new ApolloServer({ schema });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 5000 },
    });
    console.log(`GraphQL server ready at ${url}`);
};

initialize();
