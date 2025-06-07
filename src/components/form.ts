import { IOrder } from '../types';
import { AppState } from './AppState';
import { TPayment } from '../types';

export class PaymentAndAddressForm  {
	private appState: AppState;
	private container: HTMLElement;

	constructor(appState: AppState) {
		this.appState = appState;
		this.container = document.querySelector('#modal-container .modal__content') as HTMLElement;
	}

	render() {
		const template = document.getElementById('order') as HTMLTemplateElement;
		const node = template.content.cloneNode(true) as HTMLElement;
		const form = node.querySelector('form') as HTMLFormElement;
		const buttons = node.querySelectorAll('.order__buttons .button');
		const addressInput = form.elements.namedItem('address') as HTMLInputElement;
		const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
		const errorContainer = form.querySelector('.form__errors') as HTMLElement;

		// Выбор способа оплаты
        buttons.forEach(buttonEl => {
            const button = buttonEl as HTMLButtonElement;

            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');

                const paymentMethod = button.name as TPayment;

                this.appState.setOrder({
                    ...this.appState.getOrder(),
                    payment: paymentMethod,
                });

                checkValid();
            });
        });

		// Ввод адреса
		addressInput.addEventListener('input', () => {
			this.appState.setOrder({
				...this.appState.getOrder(),
				address: addressInput.value.trim(),
			});
			checkValid();
		});

		// Проверка валидности
		const checkValid = () => {
			const order = this.appState.getOrder();
			const isValid = !!order.address && !!order.payment;
			submitButton.disabled = !isValid;

			if (!isValid) {
				errorContainer.textContent = 'Введите адрес и выберите способ оплаты';
			} else {
				errorContainer.textContent = '';
			}
		};

		// Отправка формы
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.appState.events.emit('order:confirmed'); // будет следующий шаг
		});

		this.container.innerHTML = ''; // очищаем модалку
		this.container.appendChild(node);
	}
}

export class OrderContactsForm {
	private appState: AppState;
	private container: HTMLElement;

	constructor(appState: AppState) {
		this.appState = appState;
		this.container = document.querySelector('#modal-container .modal__content') as HTMLElement;
	}

	render() {
		const template = document.getElementById('contacts') as HTMLTemplateElement;
		const node = template.content.cloneNode(true) as HTMLElement;
		const form = node.querySelector('form') as HTMLFormElement;
		const emailInput = form.elements.namedItem('email') as HTMLInputElement;
		const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
		const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
		const errorContainer = form.querySelector('.form__errors') as HTMLElement;

		const checkValid = () => {
			const email = emailInput.value.trim();
			const phone = phoneInput.value.trim();
			const isValid = !!email && !!phone;

			submitButton.disabled = !isValid;

			if (!isValid) {
				errorContainer.textContent = 'Заполните email и телефон';
			} else {
				errorContainer.textContent = '';
			}
		};

		emailInput.addEventListener('input', checkValid);
		phoneInput.addEventListener('input', checkValid);

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			this.appState.setOrder({
				...this.appState.getOrder(),
				email: emailInput.value.trim(),
				phone: phoneInput.value.trim(),
			});

			this.appState.events.emit('contacts:confirmed');
		});

		this.container.innerHTML = '';
		this.container.appendChild(node);
	}
}