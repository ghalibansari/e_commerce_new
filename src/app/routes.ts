import { Application } from "express";
import { AuthController } from "./modules/auth/auth.controller";
import { BannerController } from "./modules/banners/banner.controller";
import { BrandController } from "./modules/brand/brand.controller";
import { CartController } from "./modules/cart/cart.controller";
import { CategoryController } from "./modules/categories/categories.controller";
import { CityController } from "./modules/city/city.controller";
import { ContactUsController } from "./modules/enquiry/enquiry.controller";
import { CouponController } from "./modules/coupon/coupon.controller";
import { CustomController } from "./modules/custom/custom.controller";
import { EmailHistoryController } from "./modules/email-history/email-history.controller";
import { ProductImagesController } from "./modules/product-images/product-images.controller";
import { OrderCouponController } from "./modules/order-coupon/order-coupon.controller";
import { OrderProductController } from "./modules/orders-products/order-products.controller";
import { OrderController } from "./modules/orders/order.controller";
import { PinCodeController } from "./modules/pincode/pincode.controller";
import { ProductController } from "./modules/products/product.controller";
import { StateController } from "./modules/state/state.controller";
import { TagController } from "./modules/tags/tags.controller";
import { TemplateController } from "./modules/template/template.controller";
import { UserAddressController } from "./modules/user-address/user-address.controller";
import { UserController } from "./modules/user/user.controller";
import { WishlistController } from "./modules/wishlist/wishlist.controller";
import { OrderHistoryController } from "./modules/orders-history/order-history.controller";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new AuthController().register(app)
    new TemplateController().register(app)
    new CategoryController().register(app)
    new BrandController().register(app)
    new BannerController().register(app)
    new UserAddressController().register(app);
    new StateController().register(app)
    new ContactUsController().register(app)
    new PinCodeController().register(app)
    new ProductImagesController().register(app)
    new CartController().register(app)
    new ProductController().register(app)
    new CouponController().register(app)
    new OrderController().register(app)
    new OrderCouponController().register(app)
    new OrderProductController().register(app)
    new CityController().register(app)
    new TagController().register(app)
    new EmailHistoryController().register(app)
    new WishlistController().register(app)
    new OrderHistoryController().register(app)


    new CustomController().register(app);
};