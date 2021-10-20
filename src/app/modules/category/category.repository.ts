import {BaseRepository} from "../BaseRepository";
import CategoryMd from "./category.model";
import { ICategory, IMCategory } from "./category.types";


export class CategoryRepository extends BaseRepository<ICategory, IMCategory> {
    constructor () {
        super(CategoryMd, "category_id", ['category_id', 'name', 'description', 'status'], [['created_on', 'DESC']])
    }
}