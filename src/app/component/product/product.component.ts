import {Component, Input} from '@angular/core';
import {Product} from "../../interface/product";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input() product: Product;
}
