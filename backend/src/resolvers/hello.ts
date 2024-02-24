import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolver {
    @Query(() => String) // This is a GraphQL type returned by the hello function
    hello() {
        return 'hello world';
    }
}