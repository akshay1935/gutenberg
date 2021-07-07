import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { debounceTime, filter, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private route: ActivatedRoute,
    private httpService:HttpService,
    private toastr: ToastrService,
    private router: Router) {
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
      switchMap(value => this.httpService.get_by_observable('books?search='+value+'&mime_type=image')
        .pipe(
          finalize(() => {})
        )
      )
    ).subscribe(data => {
      this.books = data.results;
      this.addItems(this.start, this.sum);
    });
  }

  onBookClick(book){
    if(book.formats !== undefined){
      let isFound = false;
      let link = '';
      Object.keys(book.formats).forEach((key) => {
        if(key.includes('text/html') || key.includes('text/plain') || key.includes('application/pdf')){
          isFound = true;
          if(link == ''){
            link = book.formats[key];
          }
        }
      });

      if(isFound){
        window.open(link, "_blank");
      }else{
        this.toastr.error("No viewable version available", 'Error');
      }
    }
  }

  getBooks(){
    this.httpService.get_by_observable('books?topic='+this.category+'&mime_type=image').subscribe((result) => {
      this.books = result.results;
      this.addItems(this.start, this.sum);
    }, (error)=>{
      console.log(error)
    })
  }


  addItems(index, sum) {
    for (let i = index; i < sum; ++i) {
      this.tmp.push(this.books[i]);
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
