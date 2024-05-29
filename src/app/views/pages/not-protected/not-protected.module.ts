import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotProtectedComponent } from './not-protected.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NotProtectedComponent,
  }
]

@NgModule({
  declarations: [
    NotProtectedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NotProtectedModule { }
