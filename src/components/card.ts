import { IProduct } from "../types";
import { EventEmitter } from "./base/events";
import { CDN_URL } from "../utils/constants";

export class Card {
    element: HTMLElement;
    product: IProduct;
    events: EventEmitter;

    constructor (product: IProduct, events: EventEmitter) {
        this.product = product;
        this.events = events;
        this.element = this.createCard();
    }

    private createCard(): HTMLElement {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        
        if (!template) {
            throw new Error('Шаблон #card-catalog не найден');
        }
        
        const card = template.content.firstElementChild.cloneNode(true) as HTMLElement;

        const categorySpan = card.querySelector('.card__category');
    
        if (categorySpan) {
            categorySpan.textContent = this.product.category || 'без категории';
        }

        const title = card.querySelector('.card__title');
        if(title) {
            title.textContent = this.product.title;
        }

        const price = card.querySelector('.card__price');
        if(price) {
            price.textContent = `${this.product.price} синапсов`;
        }

        const image = card.querySelector('.card__image') as HTMLImageElement;
        if(image) {
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