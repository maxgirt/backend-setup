import { Post } from '../entities/Post';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from '../types';

@Resolver()
export class PostResolver {
    @Query(() => [Post]) // This is a GraphQL type returned by the hello function
    posts(
        @Ctx() {em}: MyContext
     ): Promise<Post[]> {
        return em.find(Post, {});
    }

    //get a single post by id
    @Query(() => Post)
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: MyContext
        ): Promise<Post | null> {
        return em.findOne(Post, {id});
        }

    @Mutation(() => Post)
    async createPost( 
        @Arg('title') title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost( 
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});

        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post); //persist the changes to the db
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost( 
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, {id});
            return true;
        } catch (error) {
            return false;
        }
    }



}
