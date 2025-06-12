export class Page {
	private gallery: HTMLElement;
	private basketButton: HTMLElement;
	private basketCounter: HTMLElement;

	constructor() {
		this.gallery = document.querySelector('.gallery') as HTMLElement;
		this.basketButton = document.querySelector('.header__basket') as HTMLElement;
		this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
	}

	// Методы для доступа
	getGallery(): HTMLElement {
		return this.gallery;
	}

	setBasketCounter(count: number) {
		this.basketCounter.textContent = String(count);
	}

	// Обработчик клика по корзине
	onBasketClick(callback: () => void) {
		this.basketButton.addEventListener('click', callback);
	}
}