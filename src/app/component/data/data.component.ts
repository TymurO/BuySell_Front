import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {DataService} from "../../service/data.service";
import {CustomResponse} from "../../interface/custom-response";
import {AppState} from "../../interface/app-state";
import {DataState} from "../../enum/data-state.enum";
import {NgForm} from "@angular/forms";
import {Product} from "../../interface/product";
import {RegistrationUserDto} from "../../interface/registration-user-dto";
import {JwtRequest} from "../../interface/jwt-request";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  appState$: Observable<AppState<CustomResponse>>;
  selectedFile: File;
  addForm: boolean = false;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.appState$ = this.dataService.servers$
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED_STATE, appData: { ...response, data: { products: response.data.products.reverse() } } }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  changeAddForm() {
    this.addForm = !this.addForm;
  }

  onFileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveProduct(productForm: NgForm): void {
    const uploadData = new FormData();
    uploadData.append('product', JSON.stringify(productForm.value as Product));
    uploadData.append('photo', this.selectedFile);
    this.appState$ = this.dataService.save$(uploadData)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: { products: [response.data.product, ...this.dataSubject.value.data.products] } }
          );
          productForm.resetForm();
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  regUser(regForm: NgForm): void {
    this.appState$ = this.dataService.reg$(regForm.value as RegistrationUserDto)
      .pipe(
        map(response => {
          regForm.resetForm();
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  loginUser(loginForm: NgForm): void {
    this.appState$ = this.dataService.login$(loginForm.value as JwtRequest)
      .pipe(
        map(response => {
          loginForm.resetForm();
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  filterProducts(event: any): void {
    this.appState$ = this.dataService.filter$(event.target.value, this.dataSubject.value)
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  deleteProduct(product: Product): void {
    this.appState$ = this.dataService.delete$(product.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: { products: this.dataSubject.value.data.products.filter(p => p.id !== product.id) } }
          );
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }
}
