// components/PreviewModal.ts
import { Modal } from './modal';
import { IProduct } from '../types';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';

export class PreviewModal extends Modal {
  constructor(
    private onAddToBasket: (product: IProduct) => void // <- новый параметр
  ) {
    super();
  }

  show(product: IProduct) {
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as HTMLElement;

    (node.querySelector('.card__category') as HTMLElement).textContent = product.category;
    (node.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (node.querySelector('.card__text') as HTMLElement).textContent = product.description;
    (node.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

    const image = node.querySelector('.card__image') as HTMLImageElement;
    image.src = `${CDN_URL}/${product.image}`;
    image.alt = product.title;

    const basketButton = node.querySelector('.card__button') as HTMLButtonElement;

    if (basketButton) {
      basketButton.addEventListener('click', () => {
        this.onAddToBasket(product); // <- вызываем внешний обработчик
        this.close();
      });
    }

    this.openWithContent(node);
  }
}
