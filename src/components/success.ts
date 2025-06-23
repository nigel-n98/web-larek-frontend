import { Modal } from './modal';

export class Success extends Modal {
	private template: HTMLTemplateElement;
	private closeButton: HTMLButtonElement | null = null;

	constructor(private onClose: () => void) {
		super('.modal');
		this.template = document.getElementById('success') as HTMLTemplateElement;
	}

	render(totalPrice: number) {
		const node = this.template.content.cloneNode(true) as HTMLElement;

		const description = node.querySelector('.order-success__description');
		if (description) {
			description.textContent = `Списано ${totalPrice} синапсов`;
		}

		this.closeButton = node.querySelector('.order-success__close');
		if (this.closeButton) {
			this.closeButton.addEventListener('click', () => {
				this.close();
				this.onClose();
			});
		}

		this.openWithContent(node);
	}
}