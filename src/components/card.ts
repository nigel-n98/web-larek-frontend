import { IProduct } from "../types";
import { EventEmitter } from "./base/events";
import { CDN_URL, CATEGORY_CLASS_MAP } from "../utils/constants";

export class Card {
    element: HTMLElement;
    product: IProduct;
    events: EventEmitter;

    constructor(product: IProduct, events: EventEmitter) {
        this.product = product;
        this.events = events;
        this.element = this.createCard();
    }

    private createCard(): HTMLElement {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        
        if (!template || !template.content) {
            throw new Error('Шаблон #card-catalog не найден или не содержит content');
        }
        
        const firstElement = template.content.firstElementChild;
        if (!firstElement) {
            throw new Error('Шаблон #card-catalog пуст');
        }
        
        const card = firstElement.cloneNode(true) as HTMLElement;

        const categorySpan = card.querySelector('.card__category');
        if (categorySpan) {
            categorySpan.textContent = this.product.category || 'без категории';
            
            const normalizedCategory = this.product.category?.toLowerCase()?.trim();
            const categoryClass = CATEGORY_CLASS_MAP[normalizedCategory];
            if (categoryClass) {
                categorySpan.classList.add(categoryClass);
            }
        }

        const title = card.querySelector('.card__title');
        if (title) {
            title.textContent = this.product.title;
        }

        const price = card.querySelector('.card__price');
        if (price) {
            const isPriceless = this.product.price == null || this.product.price === 0;
            price.textContent = isPriceless ? 'Бесценно' : `${this.product.price} синапсов`;
        }

        const image = card.querySelector('.card__image') as HTMLImageElement;
        if (image) {
            image.src = `${CDN_URL}${this.product.image}`;
            image.alt = this.product.title;
        }
    
        card.addEventListener('click', () => {
            this.events.emit('card:select', this.product);
        });
        
        return card;
    }

    render(): HTMLElement {
        return this.element;
    }

    update(product: IProduct) {
        this.product = product;
        this.element = this.createCard();
    }
}