import { ObjectType, Directive, Field } from "type-graphql";

@Directive(`@key(fields: "name")`)
@ObjectType()
export default class Restaurant {
  @Field()
  name: string;

  @Field()
  star: number;

  // @Field()
  // recipes: string[];
}