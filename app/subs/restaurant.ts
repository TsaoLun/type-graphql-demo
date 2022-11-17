import { Directive, Field, ObjectType, InputType, Int } from "type-graphql";

@Directive(`@key(fields: "name")`)
@ObjectType()
export default class Restaurant {
  @Field()
  id: string;
  
  @Field()
  name: string;

  @Field()
  star: number;
}

@InputType()
export class ResaurantInput implements Partial<Restaurant> {
  @Field()
  name: string

  @Field((type) => Int)
  star: number
}