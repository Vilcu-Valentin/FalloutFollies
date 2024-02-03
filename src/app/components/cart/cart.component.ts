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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  checkout(): void {
    this.cartService.checkout();
  }

  // TODO: add method for proceeding to checkout
}
