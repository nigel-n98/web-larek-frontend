import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Card } from './components/card';
import { EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { PreviewModal } from './components/PreviewModal';
import { AppState } from './components/AppState';
import { BasketModal } from './components/basket';
import { Success } from './components/success';
import { PaymentAndAddressForm, OrderContactsForm } from './components/form';
import { Page } from './components/page';

const events = new EventEmitter();
const api = new WebLarekApi();
const appState = new AppState();
const previewModal = new PreviewModal(events);
const basketModal = new BasketModal(appState);
const success = new Success(appState);
const page = new Page();
const gallery = page.getGallery();

const orderDetailsForm = new PaymentAndAddressForm(appState);
const orderContactsForm = new OrderContactsForm(appState);

// Загружаем каталог с сервера
api.getProducts()
  .then((products: unknown) => {
    if (Array.isArray(products)) {
      appState.setCatalog(products); // теперь только обновляем модель
    } else {
      console.error('Ожидался массив продуктов, но пришло:', products);
    }
  })
  .catch(error => {
    console.error('Ошибка при загрузке каталога:', error);
  });

appState.events.on('catalog:updated', (products: IProduct[]) => {
  gallery.innerHTML = ''; // очищаем перед перерисовкой
  products.forEach(product => {
    const card = new Card(product, events);
    gallery.append(card.render());
  });
});

// Пользователь выбрал товар — сохраним в state
events.on('card:select', (product: IProduct) => {
  appState.setPreview(product);
});

events.on('basket:add', (product: IProduct) => {
  appState.addToBasket(product);
  console.log('Товар добавлен в корзину:', appState.getBasket());
});

// Подписка на изменение превью → показать модалку
appState.events.on('preview:changed', (product: IProduct) => {
  previewModal.show(product);
});


// Запуск первого шага оформления заказа (выбор оплаты + адрес)
appState.events.on('basket:order', () => {
  orderDetailsForm.render();
});

// После подтверждения первого шага — показать второй шаг (почта + телефон)
appState.events.on('order:confirmed', () => {
  orderContactsForm.render();
});

// После подтверждения второго шага — показать успешное оформление
appState.events.on('contacts:confirmed', () => {
    const order = appState.getOrder();

    if (order) {
        api.sendOrder(order)
            .then((response) => {
                console.log('Заказ отправлен:', response.id);

                // ✅ Закрываем модалку корзины
                basketModal.close();

                // ✅ Открываем окно успеха
                success.render();
            })
            .catch((error) => {
                console.error('Ошибка при отправке заказа:', error);
            });
    } else {
        console.error('Ошибка: заказ не сформирован');
    }
});

appState.events.on('basket:update', () => {
	basketModal.render();
	page.setBasketCounter(appState.getBasket().length);
});

page.onBasketClick(() => {
  basketModal.render();
});