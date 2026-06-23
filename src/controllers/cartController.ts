import CartRepository from "../repositories/cartRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import cartRepository from "../repositories/cartRepository";
import leadRepository from "../repositories/leadRepository";
import { LeadStatus } from "../common/enums";
import { Request, Response } from "express";
import { CartItem } from "../common/types";

class CartController {
  async addToCart(req: Request, res: Response) {
    try {
      const {
        product,
        productId,
        user: { id: userId },
      } = req.body;

      let existingCart = await this.fetchCart(userId, res);
      let originalPrice = product.price;
      let items = [
        {
          productId,
          productName: product.name,
          seller: product.user.name,
          price: product.price,
          sellerId: product.userId,
          productImage: product.primaryImage,
        },
      ];

      if (existingCart) {
        originalPrice = existingCart.originalPrice + product.price;
        items = [...(existingCart.items as unknown as CartItem[]), ...items];
      }

      let discountedPrice = existingCart?.isDiscountApplied
        ? originalPrice - (originalPrice * existingCart.discountValue) / 100
        : originalPrice;

      const cart = await CartRepository.addToCart(
        Number(userId),
        items,
        originalPrice,
        discountedPrice,
      );

      await leadRepository.addLead({
        buyerId: Number(userId),
        sellerId: Number(product.userId),
        productId: Number(productId),
        status: LeadStatus.ADD_TO_CART,
      });

      return res.status(201).json({
        message: "Product added to cart successfully",
        data: cart,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const {
        cart: existingCart,
        user: { id: userId },
      } = req.body;

      const existingItems: CartItem[] =
        existingCart.items as unknown as CartItem[];

      const productToRemove = existingItems.find(
        (item) => String(item.productId) === productId,
      );

      if (!productToRemove) {
        return res.status(404).json({
          error: [
            {
              path: "productId",
              msg: "We couldn't find any product with that ID in your cart. Please check and try again",
            },
          ],
        });
      }

      const updatedItems = existingItems.filter(
        (item) => String(item.productId) != productId,
      );

      const originalPrice = existingCart.originalPrice - productToRemove.price;
      const discountedPrice = existingCart.isDiscountApplied
        ? originalPrice - (originalPrice * existingCart.discountValue) / 100
        : originalPrice;

      const cart = await CartRepository.addToCart(
        Number(userId),
        updatedItems,
        originalPrice,
        discountedPrice,
      );

      await leadRepository.addLead({
        buyerId: Number(userId),
        sellerId: Number(productToRemove.sellerId),
        productId: Number(productToRemove.productId),
        status: LeadStatus.REMOVE_FROM_CART,
      });

      return res.status(206).json({
        message: "Product removed from cart successfully",
        data: cart,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getCart(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const cart = await this.fetchCart(userId, res);

      if (!cart)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find a cart for this user. Please make sure the details are correct.",
            },
          ],
        });

      return res.status(200).json({
        message: "Cart fetched successfully",
        data: cart,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;
      const cart = await CartRepository.clearCart(Number(userId));

      return res.status(206).json({
        message: "Cart cleared successfully",
        data: cart,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async applyDiscount(req: Request, res: Response) {
    try {
      const {
        discount,
        user: { id: userId },
      } = req.body;

      const cart = await this.fetchCart(userId, res);

      if (!cart)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find a cart for this user. Please make sure the details are correct.",
            },
          ],
        });

      const discountedPrice =
        cart.originalPrice - (cart.originalPrice * discount.value) / 100;

      const updatedCart = await CartRepository.applyOrRemoveDiscountOnCart(
        Number(userId),
        discountedPrice,
        discount?.value,
        true,
      );

      return res.status(200).json({
        message: "Discount applied successfully",
        data: updatedCart,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async removeDiscount(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const cart = await this.fetchCart(userId, res);

      if (!cart)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find a cart for this user. Please make sure the details are correct.",
            },
          ],
        });

      if (!cart.isDiscountApplied)
        return res.status(400).json({
          error: [
            {
              path: "discount",
              msg: "It seems that no discount has been applied to this cart at the moment",
            },
          ],
        });

      const updatedCart = await CartRepository.applyOrRemoveDiscountOnCart(
        Number(userId),
        cart.originalPrice,
        0,
        false,
      );

      return res.status(200).json({
        message: "Discount removed successfully",
        data: updatedCart,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async checkout(req: Request, res: Response) {
    try {
      const {
        addressId,
        transactionId,
        discount,
        user: { id: userId },
      } = req.body;

      const cart = await this.fetchCart(userId, res);
      if (cart) {
        let { items, originalPrice, discountedPrice } = cart;

        const checkout = await CartRepository.checkout({
          userId: Number(userId),
          items: items as unknown as CartItem[],
          originalPrice,
          discountedPrice,
          addressId: Number(addressId),
          transactionId,
          isDiscountApplied: cart.isDiscountApplied,
          discountValue: cart.discountValue,
        });

        await cartRepository.clearCart(Number(userId));

        return res.status(200).json({
          message: "Your checkout was processed successfully.",
          data: checkout,
        });
      } else {
        return res.status(400).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find a cart for this user. Please make sure the details are correct.",
            },
          ],
        });
      }
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  private fetchCart = async (
    userId: string | string[] | undefined,
    res: Response,
  ) => {
    try {
      if (userId && typeof userId)
        return await CartRepository.getCart(Number(userId));
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  };
}

export default new CartController();
