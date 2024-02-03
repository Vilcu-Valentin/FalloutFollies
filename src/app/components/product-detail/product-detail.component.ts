// product-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product = { id: 0, name: '', description: '', price: 0, imageUrl: '' };
  quantity: number = 1;

  constructor(private route: ActivatedRoute, 
    private productService: ProductService,
    private cartService: CartService,
    private dialog: MatDialog,
    private router: Router
    ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe({
        next: (data) => this.product = data,
        error: (error) => console.error('Error fetching product details', error)
      });
    }
  }

  addToCart(): void {
    this.cartService.addToCart({product: this.product, quantity: this.quantity});
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/main-page']); 
      } else {
        this.router.navigate(['/cart']); 
      }
    });
  }
}
