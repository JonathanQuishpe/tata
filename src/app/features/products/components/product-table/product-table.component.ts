import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../types/Product';

@Component({
  selector: 'app-product-table',
  imports: [],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css',
})
export class ProductTableComponent {
  @Input() items: Product[] = [];
  @Input() openMenuId: string | null = null;

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Product>();
  @Output() toggleMenu = new EventEmitter<string>();
}
