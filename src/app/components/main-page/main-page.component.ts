import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentSort: { property: 'price' | 'yield', direction: number } | null = null;
  priceFilter: [number, number] = [0, 999999]; // Default price filter
  yieldFilter: [number, number] = [0, 999999];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => { 
        this.products = response.$values;
        this.applyFilters(); // Apply filters right after fetching
      },
      error: (error) => console.error('Error fetching products', error)
    });
  }

  setPriceFilter(value: string): void {
    this.priceFilter = value.split(',').map(Number) as [number, number];
    this.applyFilters();
  }

  setYieldFilter(value: string): void {
    this.yieldFilter = value.split(',').map(Number) as [number, number];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const priceMatch = product.price >= this.priceFilter[0] && product.price <= this.priceFilter[1];
      const yieldMatch = product.yield >= this.yieldFilter[0] && product.yield <= this.yieldFilter[1];
      return priceMatch && yieldMatch;
    });
    if (this.currentSort) { 
      this.sortProducts(this.currentSort.property, this.currentSort.direction);
    }
  }

  sortProducts(property: 'price' | 'yield', direction: number): void {
    this.currentSort = { property, direction };
    this.filteredProducts.sort((a, b) => {
      return (a[property] - b[property]) * direction;
    });
  }
  
  isSortSelected(property: 'price' | 'yield', direction: number): boolean {
    return this.currentSort?.property === property && this.currentSort?.direction === direction;
  }

  getProductYieldClass(yieldValue: number): string {
    if (yieldValue < 50) return 'yield-low';
    else if (yieldValue < 100) return 'yield-medium';
    else if (yieldValue < 1000) return 'yield-high';
    else return 'yield-very-high';
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({product: product, quantity: 1});
  }
}
