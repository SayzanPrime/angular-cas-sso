import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: 'not-protected', 
    loadChildren: () => import('./views/pages/not-protected/not-protected.module').then(m => m.NotProtectedModule)
  },
  { path: 'protected', 
    loadChildren: () => import('./views/pages/protected/protected.module').then(m => m.ProtectedModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'not-protected', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
