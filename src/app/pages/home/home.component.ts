import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  Categories = ['Fiction', 'Philosophy', 'Drama', 'History', 'Humour', 'Adventure', 'Politics'];

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onCategoryClick(category){
    this.router.navigate(['/books'], { queryParams: { 'category': category}});
    console.log(category);
  }

}
