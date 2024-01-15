import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../interface/product";
import {constants} from "../../constant/constants";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;

  ngOnInit() {
    this.product.imageUrl = `${constants.apiUrl}/product/image/${this.product.id}`;
  }
}
