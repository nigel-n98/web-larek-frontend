// components/PreviewCard.ts
import { IProduct } from '../types';
import { EventEmitter } from './base/events';
import { CDN_URL, CATEGORY_CLASS_MAP } from '../utils/constants';

export class PreviewCard {
  private element: HTMLElement;

  constructor(
    private product: IProduct,
    private inBasket: boolean,
    private events: EventEmitter
  ) {
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!template) throw new Error('Шаблон card-preview не найден');

    const node = template.content.cloneNode(true) as HTMLElement;
    const card = node.querySelector('.card') as HTMLElement;

    // Категория
    const categoryElement = card.querySelector('.card__category');
    if (categoryElement) {
      categoryElement.textContent = this.product.category || 'без категории';

      Object.values(CATEGORY_CLASS_MAP).forEach(cls => categoryElement.classList.remove(cls));
      const normalized = this.product.category?.toLowerCase()?.trim();
      const categoryClass = CATEGORY_CLASS_MAP[normalized];
      if (categoryClass) categoryElement.classList.add(categoryClass);
    }

    // Название и описание
    (card.querySelector('.card__title') as HTMLElement).textContent = this.product.title;
    (card.querySelector('.card__text') as HTMLElement).textContent = this.product.description || '';

    // Цена
    const priceEl = card.querySelector('.card__price') as HTMLElement;
    const isPriceless = this.product.price == null || this.product.price === 0;
    priceEl.textContent = isPriceless ? 'Бесценно' : `${this.product.price} синапсов`;

    // Изображение
    const imageEl = card.querySelector('.card__image') as HTMLImageElement;
    if (imageEl) {
      imageEl.src = `${CDN_URL}/${this.product.image}`;
      imageEl.alt = this.product.title;
    }

    // Кнопка
    const button = card.querySelector('.card__button') as HTMLButtonElement;
    if (button) {
      if (isPriceless) {
        button.disabled = true;
        button.textContent = 'Нельзя купить';
      } else if (this.inBasket) {
        button.disabled = true;
        button.textContent = 'Уже в корзине';
      } else {
        button.textContent = 'В корзину';
        button.addEventListener('click', () => {
          this.events.emit('basket:add', this.product);
        });
      }
    }

    return node;
  }

  public render(): HTMLElement {
    return this.element;
  }
}
