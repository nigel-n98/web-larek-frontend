// components/PreviewModal.ts
import { Modal } from './modal';
import { IProduct } from '../types';
import { CDN_URL, CATEGORY_CLASS_MAP } from '../utils/constants';
import { EventEmitter } from './base/events';

export class PreviewModal extends Modal {
  constructor(private events: EventEmitter) {
    super();
  }

  show(product: IProduct, inBasket: boolean) {
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!template) throw new Error('Шаблон card-preview не найден');
    
    const node = template.content.cloneNode(true) as HTMLElement;
    const cardElement = node.querySelector('.card') as HTMLElement;

    // Категория
    const categoryElement = cardElement.querySelector('.card__category');
    if (categoryElement) {
      categoryElement.textContent = product.category || 'без категории';
      Object.values(CATEGORY_CLASS_MAP).forEach(className => categoryElement.classList.remove(className));

      const normalizedCategory = product.category?.toLowerCase()?.trim();
      const categoryClass = CATEGORY_CLASS_MAP[normalizedCategory];
      if (categoryClass) {
        categoryElement.classList.add(categoryClass);
      }
    }

    // Остальные поля
    (cardElement.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (cardElement.querySelector('.card__text') as HTMLElement).textContent = product.description || '';

    const isPriceless = product.price == null || product.price === 0;
    const priceElement = cardElement.querySelector('.card__price') as HTMLElement;
    priceElement.textContent = isPriceless ? 'Бесценно' : `${product.price} синапсов`;

    const image = cardElement.querySelector('.card__image') as HTMLImageElement;
    if (image) {
      image.src = `${CDN_URL}/${product.image}`;
      image.alt = product.title;
    }

    const basketButton = cardElement.querySelector('.card__button') as HTMLButtonElement;
if (basketButton) {
  if (isPriceless) {
    basketButton.disabled = true;
    basketButton.textContent = 'Нельзя купить';
  } else if (inBasket) {
    basketButton.disabled = true;
    basketButton.textContent = 'Уже в корзине';
  } else {
    basketButton.disabled = false;
    basketButton.textContent = 'В корзину';
    basketButton.addEventListener('click', () => {
      this.events.emit('basket:add', product);
      this.close();
    });
  }
}

    this.openWithContent(node);
  }
}
