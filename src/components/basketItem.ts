import { IProduct } from '../types';

export class BasketItem {
  element: HTMLElement;

  constructor(product: IProduct, onRemove: (id: string) => void, index: number) {
    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!template?.content.firstElementChild) {
      throw new Error('Template or its content is empty');
    }
    
    const item = template.content.firstElementChild.cloneNode(true) as HTMLElement;

    (item.querySelector('.basket__item-index') as HTMLElement).textContent = `${index + 1}`;
    (item.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (item.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

    const deleteBtn = item.querySelector('.basket__item-delete') as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => onRemove(product.id));

    this.element = item;
  }

  render(): HTMLElement {
    return this.element;
  }
}