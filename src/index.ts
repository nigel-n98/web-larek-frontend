import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Card } from './components/card';
import { EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { PreviewModal } from './components/PreviewModal';
import { AppState } from './components/AppState';
import { Modal } from './components/modal';
import { Basket } from './components/basket';
import { Success } from './components/success';
import { PaymentAndAddressForm, OrderContactsForm } from './components/form';
import { Page } from './components/page';
import { BasketItem } from './components/basketItem';
import { TPayment, IOrder } from './types';

const events = new EventEmitter();
const api = new WebLarekApi();
const appState = new AppState(events);
const previewModal = new PreviewModal(events);
const basketModal = new Modal();
const basket = new Basket(() => appState.events.emit('basket:order'));
const success = new Success(() => {});
const page = new Page();
const gallery = page.getGallery();

const orderForm = new PaymentAndAddressForm({
	getFormErrors: () => appState.getFormErrors(),
	onAddressChange: value => appState.updateOrder('address', value),
	onPaymentChange: value => appState.updateOrder('payment', value as TPayment),
	onSubmit: () => appState.events.emit('order:confirmed')
});

const contactsForm = new OrderContactsForm({
	getFormErrors: () => appState.getFormErrors(),
	onEmailChange: value => appState.updateOrder('email', value),
	onPhoneChange: value => appState.updateOrder('phone', value),
	onSubmit: () => appState.events.emit('contacts:confirmed')
});

// Загрузка каталога
api.getProducts()
	.then((products: unknown) => {
		if (Array.isArray(products)) {
			appState.setCatalog(products);
		} else {
			console.error('Ожидался массив продуктов, но пришло:', products);
		}
	})
	.catch(error => {
		console.error('Ошибка при загрузке каталога:', error);
	});

// Отрисовка каталога
appState.events.on('catalog:updated', (products: IProduct[]) => {
	gallery.innerHTML = '';
	products.forEach(product => {
		const card = new Card(product, events);
		gallery.append(card.render());
	});
});

// Выбор карточки
events.on('card:select', (product: IProduct) => {
	appState.setPreview(product);
	const alreadyInBasket = appState.getBasket().some(item => item.id === product.id);
	previewModal.show(product, alreadyInBasket);
});

events.on('basket:add', (product: IProduct) => {
	const basketItems = appState.getBasket();
	const alreadyInBasket = basketItems.some(item => item.id === product.id);

	if (alreadyInBasket) {
		alert('Товар уже в корзине');
	} else {
		appState.addToBasket(product);
	}
});

events.on('basket:item:remove', (data: { id: string }) => {
	appState.removeFromBasket(data.id);
});

// Обновление корзины
appState.events.on('basket:update', () => {
	const basketItems = appState.getBasket();

	const basketItemElements = basketItems.map((product, index) =>
		new BasketItem(product, index, events).render()
	);

	basket.setItems(basketItemElements);
	basket.setTotalPrice(appState.getTotal());
	basket.setOrderButtonEnabled(basketItems.length > 0);

	page.setBasketCounter(basketItems.length);
});

// Обновление превью
appState.events.on('preview:changed', (product: IProduct) => {
	const alreadyInBasket = appState.getBasket().some(item => item.id === product.id);
	previewModal.show(product, alreadyInBasket);
});

appState.events.on('basket:order', () => {
	orderForm.render();
	const handleFormErrors = () => orderForm.updateErrors();
	appState.events.on('formErrors:updated', handleFormErrors);
	handleFormErrors();
});

appState.events.on('order:confirmed', () => {
	contactsForm.render();
	const handleFormErrors = () => contactsForm.updateErrors();
	appState.events.on('formErrors:updated', handleFormErrors);
	handleFormErrors();
});

appState.events.on('contacts:confirmed', () => {
    const orderInfo = appState.getOrder();
    const basketItems = appState.getBasket();

    if (!orderInfo || basketItems.length === 0) {
        console.error('Ошибка: заказ не сформирован');
        return;
    }

    const finalOrder: IOrder = {
        ...orderInfo,
        items: basketItems.map(item => item.id),
        total: appState.getTotal(),
    };

api.sendOrder(finalOrder)
    .then(response => {
        console.log('Заказ отправлен:', response.id);
        basketModal.close();
        success.render(finalOrder.total);

        appState.clearBasket();
        appState.clearOrder();
        appState.events.emit('basket:update');

        // Добавьте это:
        orderForm.reset();
        contactsForm.reset();
    });
});

page.onBasketClick(() => {
	events.emit('basket:open');
});

events.on('basket:open', () => {
	appState.events.emit('basket:update');
	basketModal.setContent(basket.content);
	basketModal.open();
});
