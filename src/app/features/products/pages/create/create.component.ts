import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create',
  imports: [ProductFormComponent],
  standalone: true,
  template: `
    <div class="page">
      <div class="form-wrapper">
        <app-product-form (submitForm)="create($event)" (cancel)="reset()" />
      </div>
    </div>
  `,
})
export class CreateComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  create(data: any) {
    this.api.post('products', data).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  reset() {
    this.router.navigate(['/']);
  }
}
