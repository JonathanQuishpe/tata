import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ApiService } from '../../services/api.service';
import { Product } from '../../types/Product';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ProductFormComponent],
  template: `
    <div class="page">
      <div class="form-wrapper">
        <app-product-form
          [initialData]="product"
          [disableId]="true"
          (submitForm)="update($event)"
          (cancel)="back()"
        />
      </div>
    </div>
  `,
})
export class UpdateComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.api.get(`products/${id}`).subscribe({
      next: (data) => (this.product = data),
      error: () => this.router.navigate(['/']),
    });
  }

  update(data: Product) {
    this.api.put('products', data.id, data).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  back() {
    this.router.navigate(['/']);
  }
}
