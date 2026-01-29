import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { map, catchError, of } from 'rxjs';

import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  @Input() set initialData(value: any | null) {
    if (!value) return;

    this.form.patchValue(value);

    if (this.disableId) {
      this.form.controls.id.disable();
    }
  }

  @Input() disableId = false;

  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.nonNullable.group(
    {
      id: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          asyncValidators: [this.productIdExistsValidator()],
          updateOn: 'blur',
        },
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    },
    {
      validators: [this.revisionDateValidator],
    }
  );

  ngOnInit() {
    this.form.controls.date_release.valueChanges.subscribe((value) => {
      if (!value) {
        this.form.controls.date_revision.setValue('');
        return;
      }

      const releaseDate = new Date(value);
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(revisionDate.getFullYear() + 1);

      this.form.controls.date_revision.setValue(
        revisionDate.toISOString().split('T')[0],
        { emitEvent: false }
      );
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }

  reset() {
    this.form.reset();
  }

  revisionDateValidator(group: AbstractControl): ValidationErrors | null {
    const release = group.get('date_release')?.value;
    const revision = group.get('date_revision')?.value;

    if (!release || !revision) return null;

    const expected = new Date(release);
    expected.setFullYear(expected.getFullYear() + 1);

    return revision === expected.toISOString().split('T')[0]
      ? null
      : { invalidRevisionDate: true };
  }

  productIdExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || this.disableId) {
        return of(null);
      }

      return this.api.get(`products/verification/${control.value}`).pipe(
        map((res) => (res ? { idExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  hasError(field: string, error: string) {
    const control = this.form.get(field);
    return control?.touched && control?.hasError(error);
  }
}
