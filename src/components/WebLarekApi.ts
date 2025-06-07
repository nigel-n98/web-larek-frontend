import { Api } from "./base/api";
import { IProduct, IOrder } from "../types";
import { API_URL } from "../utils/constants";

export class WebLarekApi extends Api {
    
	constructor(baseUrl: string = API_URL) {  // Принимает baseUrl (по умолчанию API_URL)
		super(baseUrl);  // Передаёт baseUrl в конструктор родительского класса Api
	}

    getProducts(): Promise<IProduct[]> {
    return this.get('/product').then((data) => (data as { items: IProduct[] }).items);
    }

	sendOrder(order: IOrder): Promise<{ id: string }> {  // Принимает IOrder, возвращает Promise с ID заказа
		return this.post('/order', order) as Promise<{ id: string }>;  // POST-запрос на /order
	}

}