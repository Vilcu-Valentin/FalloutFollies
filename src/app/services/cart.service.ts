import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { AuthService } from './auth.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ product, quantity: 1 });
    }
    this.cartItems.next(currentItems);
    this.notifyUser(`${product.name} has been added to the cart!`);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.getValue().filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
    this.notifyUser("Product has been removed!");
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.notifyUser("The cart has been cleared!");
  }

  notifyUser(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  checkout(): void {
    const cartItems = this.cartItems.getValue();
    if (!cartItems.length) {
        this.notifyUser("Your cart is empty!");
        return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
        this.notifyUser("User not identified!");
        return;
    }

    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const orderDto = {
      userId: userId,
      orderItems: orderItems
    };

    this.http.post('https://localhost:7088/api/orders', orderDto, { headers: this.getHeaders() }).subscribe({
      next: () => {
          this.clearCart();
          this.notifyUser("Checkout successful. Your order has been placed!");
      },
      error: (error) => {
          console.error("Checkout failed", error);
          this.notifyUser("Checkout failed. Please try again later.");
      }
    });
  }

  // ... other methods like calculateTotal, etc.
}
