# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Структура проекта

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

**Важные файлы:**

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

---

## Установка и запуск

Для установки и запуска проекта:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

---

## Архитектура проекта

Архитектура основана на паттерне **MVC (Model-View-Controller)**.

- **Model (Модель)** — `AppState`, `WebLarekAPI`, отвечают за данные и их обработку.
- **View (Представление)** — компоненты интерфейса: `Card`, `Form`, `Modal`, `Basket`, `Page`, `Success`.
- **Controller** реализован через `EventEmitter`, связывающий модель и представление.

---

## Классы проекта

### Model

#### `AppState`

**Поля:**
- `catalog: IProduct[]`
- `basket: IProduct[]`
- `order: IOrder | null`
- `formErrors: FormErrors`
- `events: EventEmitter`

**Методы:**
- `setCatalog(items: IProduct[])`
- `getCatalog()`
- `addToBasket(product: IProduct)`
- `removeFromBasket(productId: string)`
- `getBasket()`
- `setOrder(data: IOrder)`
- `getOrder()`
- `validateOrder()`
- `clear()`
- `setFormErrors(errors: FormErrors)`
- `getFormErrors()`

---

#### `WebLarekAPI`

**Поля:**
- `baseUrl: string`

**Методы:**
- `getProducts()`
- `sendOrder(order: IOrder)`

---

### View

#### `Card`

**Поля:**
- `element: HTMLElement`
- `product: IProduct`
- `events: EventEmitter`

**Методы:**
- `render()`
- `update(product: IProduct)`

---

#### `Modal`

**Поля:**
- `element: HTMLElement`
- `content: HTMLElement`
- `events: EventEmitter`

**Методы:**
- `open(content: HTMLElement)`
- `close()`
- `setContent(content: HTMLElement)`

---

#### `Form`

**Поля:**
- `element: HTMLFormElement`
- `formData: TOrderInfo`
- `events: EventEmitter`

**Методы:**
- `getData()`
- `setErrors(errors: FormErrors)`
- `clear()`

---

#### `Page`

**Поля:**
- `element: HTMLElement`
- `views: Record<string, HTMLElement>`
- `currentView: string`

**Методы:**
- `show(viewName: string)`
- `registerView(name: string, element: HTMLElement)`

---

#### `Basket`

**Поля:**
- `element: HTMLElement`
- `items: IProduct[]`
- `total: number`
- `events: EventEmitter`

**Методы:**
- `render()`
- `update(items: IProduct[])`

---

#### `Order`

**Поля:**
- `element: HTMLElement`
- `contactFields: TOrderInfo`
- `paymentMethod: TPayment`
- `events: EventEmitter`

**Методы:**
- `getData()`
- `setData(data: IOrder)`
- `validate()`
- `clear()`

---

#### `Success`

**Поля:**
- `element: HTMLElement`
- `message: string`

**Методы:**
- `render()`
- `setMessage(text: string)`

---

## Взаимодействие компонентов

1. Пользователь взаимодействует с представлением (`Card`, `Form`, `Basket`).
2. Компоненты генерируют события через `EventEmitter`.
3. `AppState` реагирует, обновляет данные и эмитит события.
4. Представление подписано на события и обновляется автоматически.

Все компоненты взаимодействуют только через `EventEmitter` — без прямых зависимостей.

---

## Типы данных

- `IProduct` — описание товара.
- `IOrder` — контактные и платёжные данные пользователя.
- `TOrderInfo` — данные формы заказа.
- `FormErrors` — ошибки формы.
- `TBasket` — сообщения для корзины.
- `TCategory` — категории товара.
- `TPayment` — способы оплаты.
