import { Recipe } from "./schema_type";
import { Field, InputType } from "type-graphql";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
