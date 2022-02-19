import { Op } from "sequelize";
import { BannerRepository } from "../banners/banner.repository";
import { BrandRepository } from "../brand/brand.repository";
import { CategoriesRepository } from "../categories/categories.repository";
import { ProductRepository } from "../products/product.repository";
import { TagRepository } from "../tags/tags.repository";



export class CustomRepository {
    home = async (): Promise<any> => {
        const BrandRepo = new BrandRepository(), CategoriesRepo = new CategoriesRepository(), TagRepo = new TagRepository();
        const [brandHeader, categoriesHeader, banner, categories, subCategories, brand] = await Promise.all([
            await BrandRepo.findBulkBR({ where: { show_on_header: true }, attributes: ['brand_id', 'brand_name'], include: [{ model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }, { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], order: [['order_sequence', 'ASC']] }),
            await CategoriesRepo.findBulkBR({ where: { show_on_header: true, parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', where: { show_on_header: true }, attributes: ['category_name', 'category_id'], include: { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }, order: [['order_sequence', 'ASC']] }, { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], attributes: ['category_name', 'category_id', 'order_sequence'], order: [['order_sequence', 'ASC']] }),

            await new BannerRepository().findBulkBR({ where: { show_on_home_screen: true }, attributes: ["banner_id", "banner_image", "banner_text", 'link_to', 'link_id'], order: [['order_sequence', 'ASC']] }),
            await CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'], include: { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }, order: [['order_sequence', 'ASC']] }, { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], attributes: ['category_name', "category_image", 'category_id', 'order_sequence'], order: [['order_sequence', 'ASC']] }),
            await CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: { [Op.ne]: null } }, attributes: ["category_image", "category_id", "category_name"], include: [{ model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], order: [['order_sequence', 'ASC']] }),
            await BrandRepo.findBulkBR({ where: { show_on_home_screen: true }, attributes: ["brand_id", "brand_name", "brand_image", 'order_sequence'], include: [{ model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], order: [['order_sequence', 'ASC']] })
        ])
        return { header: { brand: brandHeader, categories: categoriesHeader }, banner, categories, subCategories, brand };
    };

    filter = async (): Promise<any> => {
        const CategoriesRepo = new CategoriesRepository();
        const [categories, brand, amountMinmax] = await Promise.all([
            await CategoriesRepo.findBulkBR({ where: { parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'] }], attributes: ['category_name', 'category_ids'] }),
            await new BrandRepository().findBulkBR({ where: { show_on_home_screen: true }, attributes: ["brand_image", "brand_name", "brand_id"] }),
            await new ProductRepository().findColumnMinMax({ columnName: 'selling_price' })
        ]);
        return { categories, amountMinmax, brand };
    };
}