// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  calculateTotals(): void {
    this.cartTotal = this.cartService.calculateCartTotal();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      const confirmRemoval = confirm("Quantity is zero. Remove item from cart?");
      if (confirmRemoval) {
        this.removeFromCart(productId);
      }
      return;
    }
    this.cartService.inc_updateQuantity(productId, quantity);
  }

  checkout(): void {
    this.cartService.checkout();
  }

  // TODO: add method for proceeding to checkout
}
