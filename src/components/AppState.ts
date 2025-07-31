import { EventEmitter } from './base/events'; // проверь путь к EventEmitter
import { IProduct, IOrder, FormErrors, TOrderInfo } from '../types';

export class AppState {
    private catalog: IProduct[] = [];
    private basket: IProduct[] = [];
    private order: IOrder | null = null;
    private formErrors: FormErrors = {};
    private preview: IProduct | null = null; //////////////////////////////////////
    public events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.events.emit('catalog:updated', items);
    }

    getCatalog(): IProduct[] {
        return this.catalog;
    }

    // пока добавим заглушки для корзины, заказа и ошибок
    addToBasket(product: IProduct) {
        this.basket.push(product);
        this.events.emit('basket:update');
    }

    removeFromBasket(productId: string) {
	const index = this.basket.findIndex(p => p.id === productId);
	if (index !== -1) {
		this.basket.splice(index, 1); // удаляет только первый найденный
		this.events.emit('basket:update');
	}
}

    getBasket(): IProduct[] {
        return this.basket;
    }

    clearBasket() {
    this.basket = [];
    this.events.emit('basket:update');
    }
    
    clearOrder() {
    this.order = null;
}

updateOrder<K extends keyof TOrderInfo>(key: K, value: TOrderInfo[K]) {
    if (!this.order) {
        this.order = {
            address: '',
            email: '',
            phone: '',
            payment: 'Card',
            total: 0,
            items: [],
        };
    }

    (this.order as TOrderInfo)[key] = value;

    this.setFormErrors({});

    if (key === 'address' || key === 'payment') {
        this.validateOrderInfo();
    } else if (key === 'email' || key === 'phone') {
        this.validateContacts();
    }

    // this.events.emit('formErrors:updated');
}

    getOrder(): IOrder | null {
        return this.order;
    }

    setFormErrors(errors: FormErrors) {
        this.formErrors = errors;
        this.events.emit('formErrors:updated');
    }

    getFormErrors(): FormErrors {
        return this.formErrors;
    }
    //////////////////////////////////////////
    setPreview(product: IProduct) {
    this.preview = product;
    this.events.emit('preview:changed', product);
}
    ////////////////////////////////////////////
    getPreview(): IProduct | null {
        return this.preview;
    }
    
    getBasketIds(): string[] {
        return this.basket.map(product => product.id);
    }

    getTotal(): number {
        return this.basket.reduce((sum, product) => sum + product.price, 0);
    }

    //////////////////////////////////////////////////
    validateOrderInfo(): boolean {
        const order = this.order;
        if (!order) return false;

        const errors: FormErrors = {};

        if (!order.address) {
            errors.address = 'Введите адрес';
        }

        if (!order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        this.setFormErrors(errors);


        this.events.emit('order:validate', errors);

        return Object.keys(errors).length === 0;
    }
    ///////////////////////////////////
    validateContacts(): boolean {
        const order = this.order;
        if (!order) return false;

        const errors: FormErrors = {};

        if (!order.email) {
            errors.email = 'Введите email';
        }

        if (!order.phone) {
            errors.phone = 'Введите телефон';
        }

        this.setFormErrors(errors);

        this.events.emit('order:validate', errors);

        return Object.keys(errors).length === 0;
    }

}