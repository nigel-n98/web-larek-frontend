import { IProduct } from '../types';
import { BasketItem } from './basketItem';

export class Basket {
	private listElement: HTMLElement;
	private totalPriceEl: HTMLElement;
	private orderButton: HTMLButtonElement;
	private element: HTMLElement;

	constructor(private onOrder: () => void, private onRemove: (productId: string) => void) {
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

	setItems(items: IProduct[]) {
		this.listElement.innerHTML = '';

		const elements = items.map((product, index) =>
			new BasketItem(product, this.onRemove, index).render()
		);

		this.listElement.append(...elements);
	}

	setTotalPrice(price: number) {
		this.totalPriceEl.textContent = `${price} синапсов`;
	}

	setOrderButtonEnabled(enabled: boolean) {
		this.orderButton.disabled = !enabled;
	}
}