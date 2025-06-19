import { AppState } from './AppState';
import { TPayment } from '../types';

export class PaymentAndAddressForm {
	private appState: AppState;
	private container: HTMLElement;
	private formNode: HTMLElement;

	constructor(appState: AppState) {
		this.appState = appState;
		this.container = document.querySelector('#modal-container .modal__content') as HTMLElement;

		const template = document.getElementById('order') as HTMLTemplateElement;
		this.formNode = template.content.cloneNode(true) as HTMLElement;

		this.init();
	}

	private init() {
		const form = this.formNode.querySelector('form') as HTMLFormElement;
		const buttons = this.formNode.querySelectorAll('.order__buttons .button');
		const addressInput = form.elements.namedItem('address') as HTMLInputElement;
		const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
		const errorContainer = form.querySelector('.form__errors') as HTMLElement;

		this.appState.events.on('formErrors:updated', () => {
			const errors = this.appState.getFormErrors();
			const isValid = Object.keys(errors).length === 0;

			submitButton.disabled = !isValid;
			errorContainer.textContent = isValid ? '' : 'Введите адрес и выберите способ оплаты';
		});

		buttons.forEach(buttonEl => {
			const button = buttonEl as HTMLButtonElement;
			button.addEventListener('click', () => {
				buttons.forEach(btn => btn.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');

				const paymentMethod = button.name as TPayment;
				this.appState.updateOrder('payment', paymentMethod); // ✅ заменено
				this.appState.validateOrderInfo();
			});
		});

		addressInput.addEventListener('input', () => {
			this.appState.updateOrder('address', addressInput.value.trim()); // ✅ заменено
			this.appState.validateOrderInfo();
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.appState.events.emit('order:confirmed');
		});
	}

	render() {
		this.container.innerHTML = '';
		this.container.appendChild(this.formNode);
	}
}

export class OrderContactsForm {
	private appState: AppState;
	private container: HTMLElement;
	private formNode: HTMLElement;

	constructor(appState: AppState) {
		this.appState = appState;
		this.container = document.querySelector('#modal-container .modal__content') as HTMLElement;

		const template = document.getElementById('contacts') as HTMLTemplateElement;
		this.formNode = template.content.cloneNode(true) as HTMLElement;

		this.init();
	}

	private init() {
		const form = this.formNode.querySelector('form') as HTMLFormElement;
		const emailInput = form.elements.namedItem('email') as HTMLInputElement;
		const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
		const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
		const errorContainer = form.querySelector('.form__errors') as HTMLElement;

		this.appState.events.on('formErrors:updated', () => {
			const errors = this.appState.getFormErrors();
			const isValid = Object.keys(errors).length === 0;

			submitButton.disabled = !isValid;
			errorContainer.textContent = isValid ? '' : 'Заполните email и телефон';
		});

		emailInput.addEventListener('input', () => {
			this.appState.updateOrder('email', emailInput.value.trim()); // ✅ заменено
			this.appState.validateContacts();
		});

		phoneInput.addEventListener('input', () => {
			this.appState.updateOrder('phone', phoneInput.value.trim()); // ✅ заменено
			this.appState.validateContacts();
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.appState.events.emit('contacts:confirmed');
		});
	}

	render() {
		this.container.innerHTML = '';
		this.container.appendChild(this.formNode);
	}
}
