import {createElement} from '../render.js';
import { humanizeTaskDueDate, DateFormat } from '../utils.js';

function createOffferTemplate (offer, checkedOffer) {
  if (offer.length === 0) {
    return '';
  }

  return `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offer.offers.map((item) => (`
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${item.id}" type="checkbox" name="event-offer-luggage" ${checkedOffer.find((checkedId) => checkedId.id === item.id) ? 'checked' : null}>
                <label class="event__offer-label" for="event-offer-luggage-${item.id}">
                  <span class="event__offer-title">${item.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${item.price}</span>
                </label>
              </div>`)).join('')}
            </div>
          </section> `;
}

function createTypeTemplate (allOffers, type, id) {
  return `<div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${allOffers.map((item) => (`
                <div class="event__type-item">
                  <input id="event-type-${item.type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}" ${item.type === type ? 'checked' : null}>
                  <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${id}">${item.type}</label>
                </div>`)).join('')}
              </fieldset>
            </div>
          </div>`;
}

function createGroupDestinationTemplate (allDestinations, type, destination, id) {
  return `<div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${allDestinations.map((item) => (`<option value="${item.name}"></option>`)).join('')}
            </datalist>
          </div>`;
}

function createTimeTemplate(id, dateFrom, dateTo) {
  return `<div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom, DateFormat.dateTime)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo, DateFormat.dateTime)}">
          </div>
  `;
}

function createPriceTemplate(id, price) {
  return `<div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
          </div>
  `;
}

function createButtonsTemplate(id) {
  if (!id) {
    return `
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>`;
  }
  return `
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`;
}

function createDescriptionTemplate(description) {
  return `<p class="event__destination-description">${description}</p>`;
}

function createPictureTemplate(pictures) {
  if (!pictures.length) {
    return '';
  }
  return `${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}`;
}

function createEditEventTemplate(point, checkedOffer, offer, allOffers, destination, allDestinations) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const pointId = point.id || 0;
  const price = checkedOffer.reduce((accumulator, currentValue) => accumulator + currentValue.price, basePrice);
  const description = destination.description ? destination.description : '';
  const pictures = destination.pictures.length > 0 ? destination.pictures : [];

  const offresTemplate = createOffferTemplate(offer, checkedOffer);
  const buttonsTemplate = createButtonsTemplate(pointId);
  const priceTemplate = createPriceTemplate(pointId, price);
  const timeTemplate = createTimeTemplate(pointId, dateFrom, dateTo);
  const destinationTemplate = createGroupDestinationTemplate(allDestinations, type, destination, pointId);
  const typeTemplate = createTypeTemplate(allOffers, type, pointId);
  const descriptionTemplate = createDescriptionTemplate(description);
  const pictureTemplate = createPictureTemplate(pictures);


  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  ${typeTemplate}

                  ${destinationTemplate}

                  ${timeTemplate}

                  ${priceTemplate}

                  ${buttonsTemplate}
                </header>
                <section class="event__details">
                  ${offresTemplate}

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    ${descriptionTemplate}

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${pictureTemplate}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class EditEventView {

  constructor({point, checkedOffer, offer, allOffers, destination, allDestinations}) {
    this.point = point;
    this.checkedOffer = checkedOffer;
    this.offer = offer;
    this.allOffers = allOffers;
    this.destination = destination;
    this.allDestinations = allDestinations;
  }

  getTemplate() {

    return createEditEventTemplate(
      this.point,
      this.checkedOffer,
      this.offer,
      this.allOffers,
      this.destination,
      this.allDestinations,
    );
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
