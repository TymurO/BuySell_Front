import {Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "./interface/app-state";
import {CustomResponse} from "./interface/custom-response";
import {DataService} from "./service/data.service";
import {DataState} from "./enum/data-state.enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
