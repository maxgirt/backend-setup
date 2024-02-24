import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field(() => String) // This is a GraphQL type
    @Property({ type: 'timestamp'}) 
    createdAt?: Date = new Date();

    @Field(() => String)
    @Property({ type: 'timestamp', onUpdate: () => new Date() })
    updatedAt?: Date = new Date();

    @Field()
    @Property({ type: 'text', unique: true})
    username!: string;

    //cannot be selected from the db
    @Property({ type: 'text'})
    password!: string;

}
// Property is a decorator that tells MikroORM that this is a column in the database.