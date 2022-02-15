import { BaseRepository } from "../BaseRepository";
import { CategoriesMd } from "./categories.model";
import { ICategories, IMCategories } from "./categories.type";

export class CategoriesRepository extends BaseRepository<ICategories, IMCategories> {
    constructor() {
        super(CategoriesMd, 'category_id', ['*']);
    }
}