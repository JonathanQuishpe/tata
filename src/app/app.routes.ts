import { Routes } from '@angular/router';
import { ListComponent } from './features/products/pages/list/list.component';
import { CreateComponent } from './features/products/pages/create/create.component';
import { UpdateComponent } from './features/products/pages/update/update.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'edit/:id',
    component: UpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
