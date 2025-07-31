export class Success {
	private template: HTMLTemplateElement;
	private element: HTMLElement;
	private description: HTMLElement | null;
	private closeButton: HTMLButtonElement | null;

	constructor(private onClose: () => void) {
		this.template = document.getElementById('success') as HTMLTemplateElement;

		// Клонируем шаблон один раз
		this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.description = this.element.querySelector('.order-success__description');
		this.closeButton = this.element.querySelector('.order-success__close');

		// Назначаем обработчик на кнопку закрытия
		if (this.closeButton) {
			this.closeButton.addEventListener('click', () => {
				this.onClose(); // Закрытие передано извне
			});
		}
	}

	/**
	 * Метод подставляет сумму в DOM и возвращает готовый элемент
	 */
	render(totalPrice: number): HTMLElement {
		if (this.description) {
			this.description.textContent = `Списано ${totalPrice} синапсов`;
		}
		return this.element;
	}
}