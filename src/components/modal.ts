import { IProduct } from '../types';

export class Modal {
  protected container: HTMLElement;
  protected content: HTMLElement;
  protected closeButtons: NodeListOf<HTMLButtonElement>;

  constructor(selector: string = '.modal') {
    this.container = document.querySelector(selector) as HTMLElement;
    this.content = this.container.querySelector('.modal__content') as HTMLElement;
    this.closeButtons = this.container.querySelectorAll('.modal__close');

    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    // Обработка ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.open) {
        this.close();
      }
    });

  }

  open() {
    this.container.classList.add('modal_active');
    document.body.classList.add('modal-open');  // блокируем прокрутку
  }

  close() {
    this.container.classList.remove('modal_active');
    document.body.classList.remove('modal-open'); // восстанавливаем прокрутку
  }

  setContent(node: HTMLElement) {
    this.content.innerHTML = '';
    this.content.appendChild(node);
  }

  openWithContent(node: HTMLElement) {
    this.setContent(node);
    this.open();
  }
}