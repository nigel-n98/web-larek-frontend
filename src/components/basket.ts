import { Modal } from './modal';
import { IProduct } from '../types';
import { AppState } from './AppState';
import { BasketItem } from './basketItem'; // добавлен новый импорт

export class BasketModal extends Modal {
	private listElement: HTMLElement;
	private totalPriceEl: HTMLElement;
	private orderButton: HTMLButtonElement;

	constructor(private appState: AppState) {
		super();

		const template = document.getElementById('basket') as HTMLTemplateElement;
		const content = template.content.cloneNode(true) as HTMLElement;

		this.listElement = content.querySelector('.basket__list') as HTMLElement;
		this.totalPriceEl = content.querySelector('.basket__price') as HTMLElement;
		this.orderButton = content.querySelector('.basket__button') as HTMLButtonElement;

		this.orderButton.addEventListener('click', () => {
			if (!this.orderButton.disabled) {
				this.appState.events.emit('basket:order');
			}
		});

		// сохранённый контент шаблона
		this.setContent(content);

		// подписка
		this.appState.events.on('basket:update', () => {
			this.render();
		});
	}

	set list(items: HTMLElement[]) {
		this.listElement.innerHTML = '';
		this.listElement.append(...items);
	}

	private updateOrderButtonState() {
		const basketLength = this.appState.getBasket().length;
		this.orderButton.disabled = basketLength === 0;
	}

	render() {
		const basketItems = this.appState.getBasket();
		let total = 0;

		const itemsElements = basketItems.map((product, index) => {
			total += product.price;
			const item = new BasketItem(product, this.appState.removeFromBasket.bind(this.appState), index);
			return item.render();
		});

		this.totalPriceEl.textContent = `${total} синапсов`;
		this.list = itemsElements;
		this.updateOrderButtonState();
		this.open(); // только открытие, без перерендера DOM
	}
}