import { db } from "~/server/db";
import { createCategoryModule } from "./category";

export const categoryModule = createCategoryModule(db);

export type { CategoryView, RestaurantView } from "./category";
