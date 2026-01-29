import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../types/Product';
import { ApiResponse } from '../../types/ApiResponse';
import { finalize } from 'rxjs/operators';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { PaginationTableComponent } from '../../components/pagination-table/pagination-table.component';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { FormsModule } from '@angular/forms';
import { SkeletonTableComponent } from '../../components/skeleton-table/skeleton-table.component';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ProductTableComponent,
    PaginationTableComponent,
    DeleteModalComponent,
    SkeletonTableComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  openMenuId: string | null = null;
  itemToDelete: any = null;
  items: Product[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  deleteError: string | null = null;
  filteredItems: Product[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.api
      .get<ApiResponse<Product[]>>('products')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.items = res.data;
          this.applyFilters();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage =
            'No se pudo cargar la información. Intenta nuevamente.';
        },
      });
  }

  get hasItems(): boolean {
    return this.items.length > 0;
  }

  editItem(id: string) {
    this.router.navigate(['/edit', id]);
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  deleteItem() {
    this.deleteError = null;

    this.api.delete('products', this.itemToDelete.id).subscribe({
      next: () => {
        this.itemToDelete = null;
        this.loadProducts();
      },
      error: (err) => {
        console.log(err);
        this.deleteError = `Ocurrió un error al eliminar el producto. ${this.itemToDelete.name}`;
        this.itemToDelete = null;
      },
    });
  }

  confirmDelete(item: any) {
    this.openMenuId = null;
    this.itemToDelete = item;
  }

  cancelDelete() {
    this.itemToDelete = null;
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  cleanFilter() {
    this.searchTerm = "";
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredItems = !term
      ? [...this.items]
      : this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );

    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredItems.length / this.pageSize)
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.applyFilters();
  }
}
