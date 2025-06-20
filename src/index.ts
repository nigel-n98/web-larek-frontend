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
const previewModal = new PreviewModal((product: IProduct) => {
	const basketItems = appState.getBasket();
	const alreadyInBasket = basketItems.some(item => item.id === product.id);

	if (alreadyInBasket) {
		alert('Товар уже в корзине');
	} else {
		appState.addToBasket(product);
	}
});
const basketModal = new Modal();
const basket = new Basket(appState, () => {
	appState.events.emit('basket:order');
});
const success = new Success(appState);
const page = new Page();
const gallery = page.getGallery();

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
	previewModal.show(product);
});

// Добавление в корзину
events.on('basket:add', (product: IProduct) => {
	appState.addToBasket(product);
});

// Обновление корзины
appState.events.on('basket:update', () => {
	const basketItems = appState.getBasket();

	const itemsElements = basketItems.map((product, index) =>
		new BasketItem(product, appState.removeFromBasket.bind(appState), index).render()
	);

	basket.list = itemsElements;
	basket.setTotalPrice(appState.getTotal());
	basket.setOrderButtonEnabled(basketItems.length > 0);

	page.setBasketCounter(basketItems.length);
});

// Обновление превью
appState.events.on('preview:changed', (product: IProduct) => {
	previewModal.show(product);
});

// Шаг 1 — адрес и оплата
appState.events.on('basket:order', () => {
	const orderDetailsForm = new PaymentAndAddressForm(appState);
	orderDetailsForm.render();
});

// Шаг 2 — контакты
appState.events.on('order:confirmed', () => {
	const orderContactsForm = new OrderContactsForm(appState);
	orderContactsForm.render();
});

// Подтверждение заказа — финал
appState.events.on('contacts:confirmed', () => {
	const partialOrder = appState.getOrder();

	if (partialOrder) {
		appState.setOrder({
			address: partialOrder.address,
			email: partialOrder.email,
			phone: partialOrder.phone,
			payment: partialOrder.payment,
		});

		const fullOrder = appState.getOrder();

		if (fullOrder) {
			api.sendOrder(fullOrder)
				.then(response => {
					console.log('Заказ отправлен:', response.id);
					basketModal.close();
					success.render();
					appState.clearBasket();
					appState.clearOrder();
				})
				.catch(error => {
					console.error('Ошибка при отправке заказа:', error);
				});
		}
	} else {
		console.error('Ошибка: заказ не сформирован');
	}
});

// Обработка клика по иконке корзины — событие вместо прямого вызова
page.onBasketClick(() => {
	events.emit('basket:open');
});

// Логика открытия корзины через событие
events.on('basket:open', () => {
	appState.events.emit('basket:update');
	basketModal.setContent(basket.content);
	basketModal.open();
});
