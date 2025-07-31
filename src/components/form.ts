import { TPayment, FormErrors } from '../types';
import { PaymentAndAddressFormParams, OrderContactsFormParams } from '../types';

export class PaymentAndAddressForm {
	private container: HTMLElement;
	private form: HTMLFormElement;
	private submitButton: HTMLButtonElement;
	private errorContainer: HTMLElement;
	private addressInput: HTMLInputElement;
	private paymentButtons: NodeListOf<HTMLButtonElement>;

	constructor(private params: PaymentAndAddressFormParams) {
		this.container = document.querySelector('#modal-container .modal__content') as HTMLElement;

		const template = document.getElementById('order') as HTMLTemplateElement;
		const content = template.content.cloneNode(true) as HTMLElement;

		this.form = content.querySelector('form') as HTMLFormElement;
		this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
		this.errorContainer = this.form.querySelector('.form__errors') as HTMLElement;
		this.addressInput = this.form.elements.namedItem('address') as HTMLInputElement;
		this.paymentButtons = this.form.querySelectorAll('.order__buttons .button') as NodeListOf<HTMLButtonElement>;

		this.init();
	}

	private init() {
		this.addressInput.addEventListener('input', () => {
			this.params.onAddressChange(this.addressInput.value.trim());
		});

		this.paymentButtons.forEach(button => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');
				this.params.onPaymentChange(button.name as TPayment);
			});
		});

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.params.onSubmit();
		});
	}

public updateErrors(errors: FormErrors) {
	const isValid = !errors.address && !errors.payment;
	this.submitButton.disabled = !isValid;
	this.errorContainer.textContent = isValid ? '' : 'Введите адрес и выберите способ оплаты';
}

	public render() {
		this.container.innerHTML = '';
		this.container.appendChild(this.form);
	}

	public reset() {
    this.addressInput.value = '';
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    this.submitButton.disabled = true;
    this.errorContainer.textContent = '';
}
}

export class OrderContactsForm {
	private container: HTMLElement;
	private form: HTMLFormElement;
	private submitButton: HTMLButtonElement;
	private errorContainer: HTMLElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;

	constructor(private params: OrderContactsFormParams) {
		this.container = document.querySelector('#modal-container .modal__content') as HTMLElement;

		const template = document.getElementById('contacts') as HTMLTemplateElement;
		const content = template.content.cloneNode(true) as HTMLElement;

		this.form = content.querySelector('form') as HTMLFormElement;
		this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
		this.errorContainer = this.form.querySelector('.form__errors') as HTMLElement;
		this.emailInput = this.form.elements.namedItem('email') as HTMLInputElement;
		this.phoneInput = this.form.elements.namedItem('phone') as HTMLInputElement;

		this.init();
	}

	private init() {
		this.emailInput.addEventListener('input', () => {
			this.params.onEmailChange(this.emailInput.value.trim());
		});

		this.phoneInput.addEventListener('input', () => {
			this.params.onPhoneChange(this.phoneInput.value.trim());
		});

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.params.onSubmit();
		});
	}

public updateErrors(errors: FormErrors) {
	const isValid = !errors.email && !errors.phone;
	this.submitButton.disabled = !isValid;
	this.errorContainer.textContent = isValid ? '' : 'Заполните email и телефон';
}

	public render() {
		this.container.innerHTML = '';
		this.container.appendChild(this.form);
	}
	public reset() {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.submitButton.disabled = true;
    this.errorContainer.textContent = '';
}
}
