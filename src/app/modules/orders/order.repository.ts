import { Transaction } from "sequelize";
import { v4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { Constant } from "../../constants";
import { randomAlphaNumeric } from "../../helper";
import { BaseRepository } from "../BaseRepository";
import { TCreateBulkBR, TCreateOneBR } from "../baseTypes";
import { BrandMd } from "../brand/brand.model";
import { CartRepository } from "../cart/cart.repository";
import { IMCart } from "../cart/cart.types";
import { CategoriesMd } from "../categories/categories.model";
import { CityMd } from "../city/city.model";
import { CouponRepository } from "../coupon/coupon.repository";
import { CouponEnum } from "../coupon/coupon.type";
import { OrderAddressRepository } from "../order-address/order-address.repository";
import { IOrderAddress } from '../order-address/order-address.types';
import { OrderCouponRepository } from "../order-coupon/order-coupon.repository";
import { IOrderCoupon } from "../order-coupon/order-coupon.type";
import { OrderHistoryRepository } from "../orders-history/order-history.repository";
import { OrderProductRepository } from "../orders-products/order-products.repository";
import { IOrderProduct } from "../orders-products/order-products.type";
import { PinCodeMd } from "../pincode/pincode.model";
import { ProductImagesMd } from "../product-images/product-images.model";
import { ProductRepository } from "../products/product.repository";
import { StatesMd } from "../state/state.model";
import { UnitMasterMd } from "../unit-master/unit-master.model";
import { UserAddressRepository } from "../user-address/user-address.repository";
import { OrderMd } from "./order.model";
import { IMOrder, IOrder, IPrepareOrder } from "./order.type";

export class OrderRepository extends BaseRepository<IOrder, IMOrder> {
    constructor() {
        super(OrderMd, 'order_id', ['*'], ['grand_total'], []);
    }

    //@ts-expect-error
    createBulkBR = async ({ newData, created_by, transaction }: Required<TCreateBulkBR<IOrder & { address: TCreateOneBR<Omit<IOrderAddress,'order_id'>>['newData'], 
        coupon: TCreateOneBR<Omit<IOrderCoupon,'order_id'>>['newData'] | null, products: TCreateBulkBR<Omit<IOrderProduct,'order_id'>>['newData'] }>>): Promise<IMOrder[]> => {

        let orderHistories: { order_id: string, status_id: string, comment: '' }[] = []
        let addressess: TCreateBulkBR<IOrderAddress>['newData'] = [];
        let coupons: TCreateBulkBR<IOrderCoupon>['newData'] = [];
        let orderProducts: TCreateBulkBR<IOrderProduct>['newData'] = [];
        let productIds: string[] = [];

        for (let i = 0; i < newData.length; i++) {
            const order_id = v4();
            newData[i].order_id = order_id;
            //@ts-expect-error
            newData[i].created_by = created_by
            //@ts-expect-error
            newData[i].updated_by = created_by

            orderHistories.push({ order_id, status_id: 'd307c673-f2fb-4ccd-b125-ef45b40802d4', comment: '' });
            addressess.push({ order_id, ...newData[i].address });
            newData[i].products.forEach((product: any) => {
                orderProducts.push({ order_id, ...product })
                productIds.push(product.product_id);
            })
            if (newData[i]?.coupon) {
                coupons.push({ order_id, ...newData[i].coupon } as TCreateOneBR<IOrderCoupon>['newData']);
            }
        }

        
        const [data] = await Promise.all([
            this._model.bulkCreate(newData, { transaction }),
            
            new OrderHistoryRepository().createBulkBR({ newData: orderHistories, created_by, transaction }),
            
            new OrderAddressRepository().createBulkBR({ newData: addressess, created_by, transaction }),
            
            new OrderCouponRepository().createBulkBR({ newData: coupons, created_by, transaction }),
            
            new OrderProductRepository().createBulkBR({ newData: orderProducts, created_by, transaction }),

            //@ts-expect-error
            new CartRepository().deleteBulkBR({ where: { product_id: productIds  }, deleted_by: created_by, delete_reason: "Order placed, hence removing from cart", transaction})
        ])

        return data;
    };

    orderCheckout = async ({ user_id, coupon_code, address_id }: IPrepareOrder) => {
        let data: { carts: IMCart[], discountAmount: number, shippingCharge: number, amount: number, finalAmount: number, couponType: string, couponDiscount: number, maxCouponDiscount: number } = { carts: [], discountAmount: 0, shippingCharge: 0, amount: 0, finalAmount: 0, couponType: '', couponDiscount: 0, maxCouponDiscount: 0 };

        let { cartTotalAmount, carts } = await new CartRepository().getCartTotalAmount({ user_id });
        data.carts = carts;
        data.finalAmount = data.amount = cartTotalAmount;

        if (coupon_code) {
            const coupon = await new CouponRepository().checkCoupon({ coupon_code });

            let discountAmount = 0;
            if (coupon.type === CouponEnum.percent) {
                discountAmount = (cartTotalAmount / 100) * coupon.discount
                if (discountAmount > coupon.max_discount_amount && coupon.max_discount_amount) discountAmount = coupon.max_discount_amount
            } else if (coupon.type === CouponEnum.rupees) {
                discountAmount = coupon.discount
            }

            if (cartTotalAmount < coupon.min_cart_amount) throw new Error(`Coupon can be only applicable on minimum cart amount of: ${coupon.min_cart_amount}`);
            const totalAmount = cartTotalAmount - discountAmount;

            data.couponDiscount = coupon.discount;
            data.couponType = coupon.type;
            data.discountAmount = discountAmount;
            data.finalAmount = totalAmount;
            data.maxCouponDiscount = coupon.max_discount_amount;
        }

        data.finalAmount += data.shippingCharge = await new UserAddressRepository().getShippingCharges({ user_id, address_id })
        return data;
    }

    /**
     * prepare order data
    */
    placeOrder = async ({ user_id, address_id, coupon_code, transaction }: Omit<IPrepareOrder, 'address_id'> & Required<Pick<IPrepareOrder, 'address_id'>> & { transaction: Transaction }) => {

        const { carts, discountAmount, shippingCharge, finalAmount } = await this.orderCheckout({ user_id, coupon_code, address_id });
        
        //1. generate unique order number for each order
        let order_number = null;
        let orderResult = null;

        do {
            order_number = randomAlphaNumeric(8);
            orderResult = await this.findOneBR({ where: { order_number } });
        } while (orderResult);
        
        let productCartHash: Record<string, number> = {};
        let productsHash: Record<string, number> = {};
        
        // 2. entry in order table
        let productIds = carts.map((cart: any) => {
            productCartHash[cart.product.product_id] = cart.quantity;
            return cart.product.product_id
        });

        if (productIds.length > Constant.order_product_limit) {
            throw new Error(`Cannot order more than ${Constant.order_product_limit} products in one order`);
        }

        const include = [
            { model: BrandMd, as: "brand", attributes: ['brand_id', 'brand_name'] },
            { model: CategoriesMd, as: "category", attributes: ['category_id', 'category_name'] },
            { model: UnitMasterMd, as: "unit", attributes: ['unit_id', 'name'] },
            { model: ProductImagesMd, as: "images", attributes: ['image_url'], where: { is_active: true }, limit: 1 },
        ];

        const ProductsRepo = new ProductRepository();
        const addressInclude = [
            {
                model: StatesMd,
                as: "state",
                attributes: ["name"]
            },
            {
                model: CityMd,
                as: "city",
                attributes: ["name"]
            },
            {
                model: PinCodeMd,
                as: "pincode",
                attributes: ["pincode", "area_name"]
            },
        ];

        const [productsData, addressData, couponData] = await Promise.all([
            ProductsRepo.findBulkBR({
                where: { product_id: productIds },
                include,
                limit: Constant.order_product_limit,
                attributes: ['category_id', 'brand_id', 'unit_id', 'weight', 'selling_price', 'base_price', 'quantity']
            }),
            new UserAddressRepository().findByIdBR({ id: address_id, include: addressInclude, raw: false  }),
            new CouponRepository().findOneBR({ where: { name: coupon_code }})
        ])

        productsData.forEach(product => { productsHash[product.product_id] = product['quantity']; })

        const ProductsUpdateQuanity = productsData.map(({ product_id }) => ProductsRepo.updateByIdBR({ id: product_id, newData: { quantity: productsHash[product_id] - productCartHash[product_id] }, updated_by: user_id, transaction }))

        const {state, city, pincode, address_1, address_2, state_id, city_id, pincode_id} = addressData as any;
        
        const address: TCreateOneBR<Omit<IOrderAddress, 'order_id'>>['newData'] = {state: state.name, city: city.name, pincode: `${pincode.pincode} (${pincode.area_name})`, address_1, address_2, state_id, city_id, pincode_id};
        
        const products: TCreateBulkBR<Omit<IOrderProduct, 'order_id'>>['newData'] = productsData.map(({ product_id, base_price, selling_price, category_id, brand_id, unit_id, weight, brand, category: {category_name}, unit: {name}  }: any) => {
            return {
                product_id,
                base_price,
                selling_price,
                category_id,
                brand_id,
                unit_id,
                weight,
                brand:brand.brand_name,
                category:category_name,
                unit:name,
                quantity: productCartHash[product_id]
            }
        })

        let coupon: TCreateOneBR<Omit<IOrderCoupon, 'order_id'>>['newData'] | null = null 
        if(couponData){
            // @ts-expect-error
            coupon = { ...couponData, discount_amount: discountAmount };
        }

        const [newOrder] = await Promise.all([
            this.createBulkBR({
                newData: [{ user_id, order_number, transaction_id: null, grand_total: finalAmount, shipping_charges: shippingCharge, type: 'COD', address, coupon , products }],
                created_by: user_id,
                transaction
            }),
            ...ProductsUpdateQuanity
        ])

        // prepare order email 
    };
}

async function checkOrder(){
    const transaction = await DB.transaction()
    await new OrderRepository().placeOrder({ user_id: "d8fcb401-14dc-4e31-af9e-628b10ba9ea5", coupon_code: "NEW10", address_id:    "29a15f22-7d75-430b-931e-62da39869a90", transaction })

    await transaction.commit();
}

//checkOrder();