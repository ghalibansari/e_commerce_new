import { Op } from "sequelize";
import { BannerRepository } from "../banners/banner.repository";
import { BrandRepository } from "../brand/brand.repository";
import { CategoriesRepository } from "../categories/categories.repository";
import { ProductRepository } from "../products/product.repository";



export class CustomRepository {
    constructor() { }

    home = async (): Promise<any> => {
        const BrandRepo = new BrandRepository(), CategoriesRepo = new CategoriesRepository();
        const [brandHeader, categoriesHeader, banner, categories, subCategories, brand] = await Promise.all([
            await BrandRepo.findBulkBR({ where: { show_on_header: true }, attributes: ['*'] }),
            await CategoriesRepo.findBulkBR({ where: { show_on_header: true, parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'], include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'] }] }], attributes: ['category_name', 'category_id'] }),

            await new BannerRepository().findBulkBR({ where: { show_on_home_screen: true } }),
            await CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'] }], attributes: ['category_name', 'category_id'] }),
            await CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: { [Op.ne]: null } } }),
            await BrandRepo.findBulkBR({ where: { show_on_home_screen: true }, attributes: ['*'] }),
        ])
        return { header: { brand: brandHeader, categories: categoriesHeader }, banner, categories, subCategories, brand };
    };

    filter = async (): Promise<any> => {
        const CategoriesRepo = new CategoriesRepository();
        const [categories, brand, amountMinmax] = await Promise.all([
            await CategoriesRepo.findBulkBR({ where: { parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'], include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'] }] }], attributes: ['category_name', 'category_id'] }),
            await new BrandRepository().findBulkBR({ where: { show_on_home_screen: true }, attributes: ['*'] }),
            await new ProductRepository().findColumnMinMax({ columnName: 'amount' }),
        ])
        return { categories, amountMinmax, brand };
    };


}