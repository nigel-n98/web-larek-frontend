import { IProduct } from '../types';
import { AppState } from './AppState';
import { BasketItem } from './basketItem';

export class Basket {
	private listElement: HTMLElement;
	private totalPriceEl: HTMLElement;
	private orderButton: HTMLButtonElement;
	private element: HTMLElement;

	constructor(
		private appState: AppState,
		private onOrder: () => void
	) {
		const template = document.getElementById('basket') as HTMLTemplateElement;
		const content = template.content.cloneNode(true) as HTMLElement;

		this.element = content.firstElementChild as HTMLElement;
		this.listElement = this.element.querySelector('.basket__list') as HTMLElement;
		this.totalPriceEl = this.element.querySelector('.basket__price') as HTMLElement;
		this.orderButton = this.element.querySelector('.basket__button') as HTMLButtonElement;

		this.orderButton.addEventListener('click', () => {
			if (!this.orderButton.disabled) {
				this.onOrder();
			}
		});
	}

	get content(): HTMLElement {
		return this.element;
	}

	/** Устанавливает список элементов корзины */
	set list(items: HTMLElement[]) {
		this.listElement.innerHTML = '';
		this.listElement.append(...items);
	}

	/** Устанавливает итоговую цену */
	setTotalPrice(price: number) {
		this.totalPriceEl.textContent = `${price} синапсов`;
	}

	/** Активирует или деактивирует кнопку заказа */
	setOrderButtonEnabled(enabled: boolean) {
		this.orderButton.disabled = !enabled;
	}
}