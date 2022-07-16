import { Op } from "sequelize";
import { DB } from '../../../configs/DB';
import { BannerRepository } from "../banners/banner.repository";
import { BrandRepository } from "../brand/brand.repository";
import { CategoriesRepository } from "../categories/categories.repository";
import { CityRepository } from "../city/city.repository";
import { OrderStatusRepository } from "../order-status/order-status.repository";
import { PinCodeRepository } from "../pincode/pincode.repository";
import { ProductRepository } from "../products/product.repository";
import { StateRepository } from "../state/state.repository";
import { TagRepository } from "../tags/tags.repository";
const { fn, col } = DB



export class CustomRepository {
    home = async (): Promise<any> => {
        const BrandRepo = new BrandRepository(), CategoriesRepo = new CategoriesRepository(), TagRepo = new TagRepository(), StateRepo = new StateRepository(), CityRepo = new CityRepository(), PincodeRepo = new PinCodeRepository(), OrderStatusRepo = new OrderStatusRepository();
        const [brandHeader, categoriesHeader, banner, categories, subCategories, brand, state, orderStatus] = await Promise.all([
            BrandRepo.findBulkBR({ where: { show_on_header: true }, attributes: ['brand_id', 'brand_name'], include: [{ model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }, { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], order: [['order_sequence', 'ASC']] }),
            CategoriesRepo.findBulkBR({ where: { show_on_header: true, parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', where: { show_on_header: true }, attributes: ['category_name', 'category_id'], include: { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }, order: [['order_sequence', 'ASC']] }, { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], attributes: ['category_name', 'category_id', 'order_sequence'], order: [['order_sequence', 'ASC']] }),

            new BannerRepository().findBulkBR({ where: { show_on_home_screen: true }, attributes: ["banner_id", "banner_image", "banner_text", 'link_to', 'link_id'], order: [['order_sequence', 'ASC']] }),
            CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: null }, include: [{ model: CategoriesRepo._model, as: 'sub_cat', attributes: ['category_name', 'category_id'], include: { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }, order: [['order_sequence', 'ASC']] }, { model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], attributes: ['category_name', "category_image", 'category_id', 'order_sequence'], order: [['order_sequence', 'ASC']] }),
            CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: { [Op.ne]: null } }, attributes: ["category_image", "category_id", "category_name"], include: [{ model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], order: [['order_sequence', 'ASC']] }),
            BrandRepo.findBulkBR({ where: { show_on_home_screen: true }, attributes: ["brand_id", "brand_name", "brand_image", 'order_sequence'], include: [{ model: TagRepo._model, as: 'tag', attributes: ['tag_id', 'name', 'text_color_code', 'background_color_code'] }], order: [['order_sequence', 'ASC']] }),
            StateRepo.findBulkBR({ attributes: ["state_id", "name"], limit: 40, order: [["name", "ASC"]] , include: [{ model: CityRepo._model, as: "cities", attributes: ["state_id", "city_id", "name"], order: [['name', 'ASC']], include: [{ model:PincodeRepo._model, as: "pincodes", attributes:["pincode_id", "city_id", "pincode", "area_name", "shipping_charges"], order:[["area_name","ASC"]] }] }] }),
            OrderStatusRepo.findBulkBR({ attributes: ["status_id", "title", "sequence", "slug"], limit: 40, order: [["sequence", "ASC"]]  })
        ])
        return { header: { brand: brandHeader, categories: categoriesHeader }, banner, categories, subCategories, brand, state, orderStatus };
    };

    filter = async (): Promise<any> => {
        const CategoriesRepo = new CategoriesRepository(), ProductRepo = new ProductRepository();

        const [categories, brand, amountMinmax] = await Promise.all([
            CategoriesRepo.findBulkBR({
                where: { parent_id: null },
                attributes: ['category_name', 'category_id'],
                include: [
                    {
                        model: CategoriesRepo._model,
                        as: 'sub_cat',
                        attributes: ['category_name', 'category_id'],
                        include: {
                            model: ProductRepo._model,
                            as: 'products',
                            attributes: ['product_id']
                        }
                    }
                ]
            }),

            new BrandRepository().findBulkBR({ where: { show_on_home_screen: true }, attributes: ["brand_name", "brand_id"] }),
            ProductRepo.findColumnMinMax({ columnName: 'selling_price' }),
        ]);

        const cat = JSON.parse(JSON.stringify(categories));

        cat.forEach((cat: any) => {
            cat.sub_cat?.forEach((subCat: any) => {
                subCat.productCount = subCat.products.length;
                delete subCat.products;
            });
        });

        return { categories: cat, amountMinmax, brand };
    };
}