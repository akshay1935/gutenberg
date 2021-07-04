import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    component : HomeComponent
  },
  {
    path: 'home',
    component : HomeComponent
  },
  {
    path: 'books',
    component : BooksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
