// import { Modal } from './modal';
// import { IProduct } from '../types';
// import { AppState } from './AppState';

// export class BasketModal extends Modal {
// 	constructor(private appState: AppState) {
// 		super();
// 	}

// 	render() {
// 		const basketItems = this.appState.getBasket();
// 		const template = document.getElementById('basket') as HTMLTemplateElement;
// 		const basketFragment = template.content.cloneNode(true) as HTMLElement;

// 		const list = basketFragment.querySelector('.basket__list') as HTMLElement;
// 		const totalPriceEl = basketFragment.querySelector('.basket__price') as HTMLElement;

// 		let total = 0;
// 		list.innerHTML = '';

// 		basketItems.forEach((product, index) => {
// 			const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
// 			const item = itemTemplate.content.cloneNode(true) as HTMLElement;

// 			(item.querySelector('.basket__item-index') as HTMLElement).textContent = `${index + 1}`;
// 			(item.querySelector('.card__title') as HTMLElement).textContent = product.title;
// 			(item.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

// 			// кнопка удаления
// 			const deleteBtn = item.querySelector('.basket__item-delete') as HTMLButtonElement;
// 			deleteBtn.addEventListener('click', () => {
// 				this.appState.removeFromBasket(product.id);
// 			});

// 			list.appendChild(item);
// 			total += product.price;
// 		});

// 		totalPriceEl.textContent = `${total} синапсов`;

//         	const orderButton = basketFragment.querySelector('.basket__button') as HTMLButtonElement;
// 	orderButton.addEventListener('click', () => {
// 		this.appState.events.emit('basket:order');
// 	});

// 		this.openWithContent(basketFragment);
// 	}
// }

import { Modal } from './modal';
import { IProduct } from '../types';
import { AppState } from './AppState';

export class BasketModal extends Modal {
	private orderButton: HTMLButtonElement | null = null;

	constructor(private appState: AppState) {
		super();

		// Подписываемся на обновление корзины
		this.appState.events.on('basket:updated', () => {
			this.updateOrderButtonState();
		});
	}

	render() {
		const basketItems = this.appState.getBasket();
		const template = document.getElementById('basket') as HTMLTemplateElement;
		const basketFragment = template.content.cloneNode(true) as HTMLElement;

		const list = basketFragment.querySelector('.basket__list') as HTMLElement;
		const totalPriceEl = basketFragment.querySelector('.basket__price') as HTMLElement;

		let total = 0;
		list.innerHTML = '';

		basketItems.forEach((product, index) => {
			const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
			const item = itemTemplate.content.cloneNode(true) as HTMLElement;

			(item.querySelector('.basket__item-index') as HTMLElement).textContent = `${index + 1}`;
			(item.querySelector('.card__title') as HTMLElement).textContent = product.title;
			(item.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

			const deleteBtn = item.querySelector('.basket__item-delete') as HTMLButtonElement;
			deleteBtn.addEventListener('click', () => {
				this.appState.removeFromBasket(product.id);
			});

			list.appendChild(item);
			total += product.price;
		});

		totalPriceEl.textContent = `${total} синапсов`;

		this.orderButton = basketFragment.querySelector('.basket__button') as HTMLButtonElement;
		this.orderButton.addEventListener('click', () => {
			if (this.orderButton?.disabled) return; // защита на всякий случай
			this.appState.events.emit('basket:order');
		});

		this.openWithContent(basketFragment);

		this.updateOrderButtonState(); // обновляем состояние кнопки после рендера
	}

	private updateOrderButtonState() {
		if (!this.orderButton) return;

		const basketLength = this.appState.getBasket().length;
		this.orderButton.disabled = basketLength === 0;
	}
}
