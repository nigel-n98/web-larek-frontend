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

const events = new EventEmitter();
const api = new WebLarekApi();
const appState = new AppState();
const previewModal = new PreviewModal(events);
const basketModal = new Modal();
const basket = new Basket(appState, () => {
	appState.events.emit('basket:order');
});
const success = new Success(appState);
const page = new Page();
const gallery = page.getGallery();

const orderDetailsForm = new PaymentAndAddressForm(appState);
const orderContactsForm = new OrderContactsForm(appState);

// Загружаем каталог с сервера
api.getProducts()
	.then((products: unknown) => {
		if (Array.isArray(products)) {
			appState.setCatalog(products); // обновляем модель
		} else {
			console.error('Ожидался массив продуктов, но пришло:', products);
		}
	})
	.catch(error => {
		console.error('Ошибка при загрузке каталога:', error);
	});

// Отображение каталога при обновлении
appState.events.on('catalog:updated', (products: IProduct[]) => {
	gallery.innerHTML = '';
	products.forEach(product => {
		const card = new Card(product, events);
		gallery.append(card.render());
	});
});

// Пользователь выбрал товар
events.on('card:select', (product: IProduct) => {
	appState.setPreview(product);
});

// Добавление в корзину
events.on('basket:add', (product: IProduct) => {
	appState.addToBasket(product);
	console.log('Товар добавлен в корзину:', appState.getBasket());
});

// Обновление корзины
appState.events.on('basket:update', () => {
	const basketItems = appState.getBasket();

	const itemsElements = basketItems.map((product, index) =>
		new BasketItem(product, appState.removeFromBasket.bind(appState), index).render()
	);

	const total = basketItems.reduce((sum, item) => sum + item.price, 0);

	basket.list = itemsElements;
	basket.setTotalPrice(total);
	basket.setOrderButtonEnabled(basketItems.length > 0);

	page.setBasketCounter(basketItems.length);
});

// Обновление превью
appState.events.on('preview:changed', (product: IProduct) => {
	previewModal.show(product);
});

// Оформление заказа — шаг 1
appState.events.on('basket:order', () => {
	orderDetailsForm.render();
});

// Подтверждение оплаты и адреса — шаг 2
appState.events.on('order:confirmed', () => {
	orderContactsForm.render();
});

// Подтверждение контактов — финал
appState.events.on('contacts:confirmed', () => {
	const order = appState.getOrder();

	if (order) {
		api.sendOrder(order)
			.then(response => {
				console.log('Заказ отправлен:', response.id);
				basketModal.close(); // закрываем корзину
				success.render(); // показываем успех
			})
			.catch(error => {
				console.error('Ошибка при отправке заказа:', error);
			});
	} else {
		console.error('Ошибка: заказ не сформирован');
	}
});

// При клике на иконку корзины
page.onBasketClick(() => {
	const basketItems = appState.getBasket();

	const itemsElements = basketItems.map((product, index) =>
		new BasketItem(product, appState.removeFromBasket.bind(appState), index).render()
	);

	const total = basketItems.reduce((sum, item) => sum + item.price, 0);

	basket.list = itemsElements;
	basket.setTotalPrice(total);
	basket.setOrderButtonEnabled(basketItems.length > 0);

	basketModal.setContent(basket.content);
	basketModal.open();
});
