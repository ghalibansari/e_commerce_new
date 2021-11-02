import { BaseRepository } from "../BaseRepository";
import { categoriesMd } from "./categories.model";
import { ICategories, IMCategories } from "./categories.type";

export class CategoriesRepository extends BaseRepository<ICategories, IMCategories> {
    constructor() {
        super(categoriesMd, 'category_id', ['*'], ['created_at'], []);
    }
}