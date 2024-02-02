import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service'; // Adjust path as necessary

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    }, error => console.error(error));
  }
}
