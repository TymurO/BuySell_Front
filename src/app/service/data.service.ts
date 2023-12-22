import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {CustomResponse} from "../interface/custom-response";
import {Product} from "../interface/product";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  servers$= <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/product/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  save$ = (data: FormData) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/product/save`, data)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  // save$ = (product: Product) => <Observable<CustomResponse>>
  //   this.http.post<CustomResponse>(`${this.apiUrl}/product/save`, product)
  //     .pipe(
  //       tap(console.log),
  //       catchError(this.handleError)
  //     );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    throw new Error(`An error occurred - Error code: ${error.status}`);
  }
}
