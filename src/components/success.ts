import { AppState } from './AppState';
import { Modal } from './modal';

export class Success extends Modal {
  private appState: AppState;

  constructor(appState: AppState) {
    super('.modal'); // селектор твоего модального окна
    this.appState = appState;
  }

  render() {
    const template = document.getElementById('success') as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as HTMLElement;

    // Обновляем сумму списания
    const totalPrice = this.appState.getBasket().reduce((sum, product) => sum + product.price, 0);
    const description = node.querySelector('.order-success__description');
    if (description) {
      description.textContent = `Списано ${totalPrice} синапсов`;
    }

    // Очистка корзины и уведомление о обновлении сразу при открытии модалки успеха
    this.appState.clearBasket();
    this.appState.events.emit('basket:updated');

    // Обработчик кнопки "За новыми покупками"
    const closeButton = node.querySelector('.order-success__close') as HTMLButtonElement;
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.close();
      });
    }

    // Обработчик кнопок закрытия (крестиков) из базового класса
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.close();
      });
    });

    this.openWithContent(node);
  }
}
