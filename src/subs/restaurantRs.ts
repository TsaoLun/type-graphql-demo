import Resaurant from "./restaurant"
import {Resolver, Query, Arg} from "type-graphql"

@Resolver(of => Resaurant)
export default class RestaurantRs {
  @Query(returns => [Resaurant])
  async topResaurant(
    @Arg("first", {defaultValue: 5})
    first: number,){
    return [{
      name:"The White",
      star: 5,
      recipes:[]
    },{
      name:"The Pink",
      star: 3,
      recipes:[]
    }]
  }
}