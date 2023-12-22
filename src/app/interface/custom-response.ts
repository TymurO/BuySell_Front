import {Product} from "./product";


export interface CustomResponse {
  timeStamp: Date;
  statusCode: number;
  status: string;
  reason: string
  message: string;
  developerMessage: string;
  data: { products?: Product[] }
}
