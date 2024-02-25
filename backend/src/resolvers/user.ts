import { User } from '../entities/User';
import { MyContext } from '../types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import argon2d from 'argon2'
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number; // this type matches the type of our user id
  }
}

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

//object types can be returned from mutations
//input types are used as arguments
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true} )
    user?: User
}



@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    async me(
        @Ctx() {req, em}: MyContext
    ) {
        // console.log('req.session: ', req.session)
        //not logged in
        if (!req.session.userId) {
            return null
        }
        const user = em.findOne(User, {id: req.session.userId})
        console.log('user: ', user)
        return user
    }
    
    //register
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ) {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }

        if (options.password.length <= 2) {
            return {
                errors: [
                    {
                    field: 'password',
                    message: 'length must be greater than 2'
                }]
            }
        }

        const hashedPassword = await argon2d.hash(options.password) //hash the password so its saved in the DB
        const user = em.create(User, {username: options.username, password: hashedPassword })
        try {
            await em.persistAndFlush(user)
        } catch (error) {
            // console.log('error: ', error);
            if (error.code === '23505' || error.detail.includes('already exists')) {
                return {
                    errors: [
                        {
                        field: 'username',
                        message: 'username already taken'
                    }]
                }
            }
        }
        
        //store user id session
        //this will set a cookie on the user and keep them logged in
        req.session.userId = user.id;
        return UserResponse
    }



    //login
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return {
                errors: [
                    {
                    field: 'username',
                    message: 'That username does not exist'
                }]
            }
        }
        const valid = await argon2d.verify(user.password, options.password) //compare hashed password with the password entered
        if (!valid) {
            return {
                errors: [
                    {
                    field: 'password',
                    message: 'Incorrect password'
                }]
            }
        }
        req.session!.userId = user.id;
        return {user}
    }


    //logout
    @Mutation(() => Boolean, {nullable: true})
    async logout(
        @Ctx() {req}: MyContext): Promise<Boolean | null> {
        if (!req.session.userId) {
            return null
        }
        // attempt to destroy the session
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy((err)=> {
                    if (err) {
                        console.log(err)
                        return reject(err);
                    } else {
                    resolve(true); //promise resolved succesfully
                    }
                });
            });
            return true; //session was destroyed succesfully
        }catch (error) {
            return false; //error with session destruction
        }
    }


}