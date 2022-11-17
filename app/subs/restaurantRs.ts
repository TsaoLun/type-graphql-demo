import Resaurant from "./restaurant";
import { Arg, Mutation, Query, Resolver, Int } from "type-graphql";
import Model from "../models/Resaurant";

@Resolver((of) => Resaurant)
export default class RestaurantRs {
  @Query((returns) => [Resaurant])
  async topResaurant(
    @Arg("first", (type)=>Int, { defaultValue: 5 }) first: number,
  ) {
    return [{
      name: "The White",
      star: 5,
      recipes: [],
    }, {
      name: "The Pink",
      star: 3,
      recipes: [],
    }];
  }

  @Mutation((returns) => Boolean)
  async addRestaurant(
    @Arg("name") name: string,
    @Arg("star", (type)=>Int, {defaultValue: 0}) star: number,
  ) {
    await Model.addRestaurant(name, star);
    return true;
  }
}
