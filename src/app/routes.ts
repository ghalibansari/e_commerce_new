import { Application } from "express";
import { AuthController } from "./modules/auth/auth.controller";
import { BannerController } from "./modules/banners/banner.controller";
import { BrandController } from "./modules/brand/brand.controller";
import { CartController } from "./modules/cart/cart.controller";
import { CategoryController } from "./modules/categories/categories.controller";
import { CityController } from "./modules/city/city.controller";
import { CouponController } from "./modules/coupon/coupon.controller";
import { CustomController } from "./modules/custom/custom.controller";
import { EmailController } from "./modules/emailHistory/email.controller";
import { ImageController } from "./modules/image/image.controller";
import { OrderCouponController } from "./modules/order-coupon/order-coupon.controller";
import { OrderProductController } from "./modules/orders-products/order-products.controller";
import { OrderController } from "./modules/orders/order.controller";
import { PinCodeController } from "./modules/pincode/pincode.controller";
import { ProductController } from "./modules/products/product.controller";
import { StateController } from "./modules/state/state.controller";
import { TagController } from "./modules/Tag/tag.controller";
import { TemplateController } from "./modules/template/template.controller";
import { UserAddressController } from "./modules/user-address/user-address.controller";
import { UserController } from "./modules/user/user.controller";
import { WishlistController } from "./modules/wishlist/wishlist.controller";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new AuthController().register(app)
    new TemplateController().register(app)
    new CategoryController().register(app)
    new BrandController().register(app)
    new BannerController().register(app)
    new UserAddressController().register(app);
    new StateController().register(app)
    new PinCodeController().register(app)
    new ImageController().register(app)
    new CartController().register(app)
    new ProductController().register(app)
    new CouponController().register(app)
    new OrderController().register(app)
    new OrderCouponController().register(app)
    new OrderProductController().register(app)
    new CityController().register(app)
    new TagController().register(app)
    new BrandController().register(app)
    new EmailController().register(app)
    new UserAddressController().register(app);
    new WishlistController().register(app);





    
    new CustomController().register(app);
};