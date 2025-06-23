import { AppState } from './AppState';
import { TPayment } from '../types';
import { PaymentAndAddressFormParams, OrderContactsFormParams } from '../types';

export class PaymentAndAddressForm {
	private container: HTMLElement;
	private formNode: HTMLElement;

	constructor(private params: PaymentAndAddressFormParams) {
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

		this.params.subscribeToErrors(() => {
			const errors = this.params.getFormErrors();
			const isValid = Object.keys(errors).length === 0;
			submitButton.disabled = !isValid;
			errorContainer.textContent = isValid ? '' : 'Введите адрес и выберите способ оплаты';
		});

		addressInput.addEventListener('input', () => {
			this.params.onAddressChange(addressInput.value.trim());
		});

		buttons.forEach(buttonEl => {
			const button = buttonEl as HTMLButtonElement;
			button.addEventListener('click', () => {
				buttons.forEach(btn => btn.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');
				this.params.onPaymentChange(button.name as TPayment);
			});
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.params.onSubmit();
		});
	}

	render() {
		this.container.innerHTML = '';
		this.container.appendChild(this.formNode);
	}
}

export class OrderContactsForm {
	private container: HTMLElement;
	private formNode: HTMLElement;

	constructor(private params: OrderContactsFormParams) {
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

		this.params.subscribeToErrors(() => {
			const errors = this.params.getFormErrors();
			const isValid = Object.keys(errors).length === 0;
			submitButton.disabled = !isValid;
			errorContainer.textContent = isValid ? '' : 'Заполните email и телефон';
		});

		emailInput.addEventListener('input', () => {
			this.params.onEmailChange(emailInput.value.trim());
		});

		phoneInput.addEventListener('input', () => {
			this.params.onPhoneChange(phoneInput.value.trim());
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.params.onSubmit();
		});
	}

	render() {
		this.container.innerHTML = '';
		this.container.appendChild(this.formNode);
	}
}