import {createElement} from '../render.js';
import { getTimePeriod, humanizeTaskDueDate, DateFormat } from '../utils.js';
import dayjs from 'dayjs';

function createItemEventTemplate(point, offer, destination) {
  const { basePrice, isFavorite, dateFrom, dateTo, type } = point;

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dayjs(dateFrom).format(DateFormat.yearMonthDay)}">${humanizeTaskDueDate(dateFrom, DateFormat.monthDay)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type}">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dayjs(dateFrom).format(DateFormat.dateTimeT)}">${humanizeTaskDueDate(dateFrom, DateFormat.hourMinute)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dayjs(dateTo).format(DateFormat.dateTimeT)}">${humanizeTaskDueDate(dateTo, DateFormat.hourMinute)}</time>
                  </p>
                  <p class="event__duration">${getTimePeriod(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${offer.map((item) => (`<li class="event__offer">
                    <span class="event__offer-title">${item.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${item.price}</span>
                  </li>`)).join('')}
                </ul>
                <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}

export default class ItemEventView {

  constructor({point, offer, destination}) {
    this.point = point;
    this.offer = offer;
    this.destination = destination;
  }

  getTemplate() {
    return createItemEventTemplate(this.point, this.offer, this.destination);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
