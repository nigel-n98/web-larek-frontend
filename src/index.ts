import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Card } from './components/card';
import { EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { PreviewModal } from './components/PreviewModal';
import { AppState } from './components/AppState';
import { BasketModal } from './components/basket';
import { Success } from './components/success';
import { PaymentAndAddressForm, OrderContactsForm } from './components/form';  // <-- импорт двух форм

const events = new EventEmitter();
const api = new WebLarekApi();
const appState = new AppState();
const previewModal = new PreviewModal(events);
const gallery = document.querySelector('.gallery') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const basketModal = new BasketModal(appState);
const success = new Success(appState);

const orderDetailsForm = new PaymentAndAddressForm(appState);
const orderContactsForm = new OrderContactsForm(appState);

// Загружаем каталог с сервера
api.getProducts()
  .then((products: unknown) => {
    if (Array.isArray(products)) {
      appState.setCatalog(products);
      products.forEach(product => {
        const card = new Card(product, events);
        gallery.append(card.render());
      });
    } else {
      console.error('Ожидался массив продуктов, но пришло:', products);
    }
  })
  .catch(error => {
    console.error('Ошибка при загрузке каталога:', error);
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

// Открытие корзины по кнопке в шапке
document.querySelector('.header__basket')?.addEventListener('click', () => {
  basketModal.render();
});

// Обновление корзины при изменении
appState.events.on('basket:updated', () => {
  basketCounter.textContent = String(appState.getBasket().length);
  // Если корзина уже открыта — перерисуем её
  if (document.querySelector('.basket')) {
    basketModal.render();
  }
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
  success.render();
});
