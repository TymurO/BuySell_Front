import {Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {DataService} from "../../service/data.service";
import {CustomResponse} from "../../interface/custom-response";
import {AppState} from "../../interface/app-state";
import {DataState} from "../../enum/data-state.enum";
import {NgForm} from "@angular/forms";
import {Product} from "../../interface/product";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  appState$: Observable<AppState<CustomResponse>>;
  selectedFile: File;
  readonly DataState = DataState;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.appState$ = this.dataService.servers$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProduct(productForm: NgForm): void {
    const uploadData = new FormData();
    uploadData.append('product', JSON.stringify(productForm.value as Product));
    uploadData.append('photo', this.selectedFile);
    this.appState$ = this.dataService.save$(uploadData)
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  // saveProduct(productForm: NgForm): void {
  //   this.appState$ = this.dataService.save$(productForm.value as Product)
  //     .pipe(
  //       map(response => {
  //         return { dataState: DataState.LOADED_STATE, appData: response }
  //       }),
  //       startWith({ dataState: DataState.LOADING_STATE }),
  //       catchError((error: string) => {
  //         return of({ dataState: DataState.ERROR_STATE, error })
  //       })
  //     );
  // }
}
