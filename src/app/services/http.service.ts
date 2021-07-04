import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public httpHeader = {};

  constructor(private http:HttpClient) { }

  post_by_observable(serviceName: string, data: any): Observable<any> {
    const headers = new HttpHeaders({});
    const options = { headers : headers, withCredintials : false};
    const url = environment.base_url + serviceName;
    return this.http.post(url, JSON.stringify(data), this.httpHeader);
  }

  get_by_observable(url: string = ""): Observable<any> {
    if (url !== "") {
      return this.http.get(environment.base_url+url, this.httpHeader);
    }
  }
}
