// Полная информация о товаре
export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    category: TCategory;
}

// Данные заказа: контактные данные + товары + сумма
export interface IOrder {
    phone: string;
    address: string;
    email: string;
    payment: TPayment;
    total: number;
    items: string[];
}

// Сообщения при работе с корзиной
export type TBasket = 'Товар добавлен в корзину' | 'Товар удалён из корзины' | 'Ошибка: товар уже в корзине' | 'Ошибка: товара нет в корзине';
// Категории товаров
export type TCategory = 'Дополнительное' | 'Другое' | 'Кнопка' | 'Софт-скил' | 'Хард-скил';
// Способы оплаты
export type TPayment = 'Card' | 'Cash';
// Упрощённые данные заказа
export type TOrderInfo = Pick<IOrder, 'address' | 'email' | 'phone' | 'payment'>
// Ошибки формы
export type FormErrors = Partial<Record<keyof TOrderInfo, string>>;
    
// types.ts (или где у тебя описаны параметры)

export interface PaymentAndAddressFormParams {
	getFormErrors: () => Partial<Record<'address' | 'payment' | 'email' | 'phone', string>>;
	onAddressChange: (value: string) => void;
	onPaymentChange: (value: string) => void;
	onSubmit: () => void;
	subscribeToErrors?: (callback: () => void) => void;
}

export interface OrderContactsFormParams {
	getFormErrors: () => Partial<Record<'address' | 'payment' | 'email' | 'phone', string>>;
	onEmailChange: (value: string) => void;
	onPhoneChange: (value: string) => void;
	onSubmit: () => void;
	subscribeToErrors?: (callback: () => void) => void;
}
