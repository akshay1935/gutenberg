import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { debounceTime, filter, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  category = '';
  searchTxt = new FormControl('');
  tmp = [];
  books = [];
  book_covers = ["cover1.jpg", "cover2.jpg", "cover4.jpg", "cover5.jpg"];

  sum = 12;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  start: number = 0;
  direction = "";

  constructor(private route: ActivatedRoute, private httpService:HttpService, private router: Router) {
    this.route.queryParams
      .subscribe(params => {
        this.category= params.category
      }
    );
  }

  ngOnInit(): void {
    this.getBooks();

    this.searchTxt.valueChanges
    .pipe(
      debounceTime(500),
      tap(() => {
        this.books = [];
        this.tmp = [];
      }),
      switchMap(value => this.httpService.get_by_observable('books?search='+value)
        .pipe(
          finalize(() => {

          })
        )
      )
    ).subscribe(data => {
      this.books = data.results;
      this.books = this.books.map((book) => {
        book.img_url = this.book_covers[Math.floor(Math.random() * this.book_covers.length)];
        return book;
      })
      this.addItems(this.start, this.sum);
    });
  }

  getBooks(){
    this.httpService.get_by_observable('books?topic='+this.category).subscribe((result) => {
      this.books = result.results;
      this.books = this.books.map((book) => {
        book.img_url = this.book_covers[Math.floor(Math.random() * this.book_covers.length)];
        return book;
      })
      this.addItems(this.start, this.sum);
    }, (error)=>{
      console.log(error)
    })
  }


  addItems(index, sum) {
    for (let i = index; i < sum; ++i) {
      this.tmp.push(this.books[i]);
      console.log(this.tmp);

    }
  }

  onScrollDown(){
    this.start = this.sum;
    this.sum += 12;
    this.getBooks();
    this.direction = "down";
  }

  clearInput(){
    this.searchTxt.setValue('');
  }

  onBack(){
    this.router.navigate(['home']);
  }

}
