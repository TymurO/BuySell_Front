import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {CustomResponse} from "../interface/custom-response";

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

  filter$ = (name: string, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      subscriber => {
        subscriber.next(
          name === "" ? { ...response, message: `Products isn't filtered` } :
            {
              ...response,
              message: response.data.products
                .filter(product => (product.name.toLowerCase()).includes(name.toLowerCase())).length > 0 ? `Products filtered by ${name}`
                : 'No products found',
              data: { products: response.data.products
                .filter(product => (product.name.toLowerCase()).includes(name.toLowerCase())) }
            }
        );
        subscriber.complete();
      }
    )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ =(productId: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/product/delete/${productId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    throw new Error(`An error occurred - Error code: ${error.status}`);
  }
}
