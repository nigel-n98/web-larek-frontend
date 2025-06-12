import { AppState } from './AppState';
import { Modal } from './modal';

export class Success extends Modal {
  private appState: AppState;
  private template: HTMLTemplateElement;
  private closeButton: HTMLButtonElement | null;

  constructor(appState: AppState) {
    super('.modal');
    this.appState = appState;
    
    // Находим все необходимые DOM элементы один раз при создании экземпляра
    this.template = document.getElementById('success') as HTMLTemplateElement;
    this.closeButton = null;

    // Вешаем обработчики на кнопки закрытия из базового класса
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.close();
      });
    });
  }

  render() {
    const node = this.template.content.cloneNode(true) as HTMLElement;

    // Обновляем сумму списания
    const totalPrice = this.appState.getBasket().reduce((sum, product) => sum + product.price, 0);
    const description = node.querySelector('.order-success__description');
    if (description) {
      description.textContent = `Списано ${totalPrice} синапсов`;
    }

    // Очистка корзины и уведомление о обновлении сразу при открытии модалки успеха
    this.appState.clearBasket();
    this.appState.events.emit('basket:update');

    // Находим и вешаем обработчик на кнопку "За новыми покупками"
    this.closeButton = node.querySelector('.order-success__close');
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.close();
      });
    }

    this.openWithContent(node);
  }
}