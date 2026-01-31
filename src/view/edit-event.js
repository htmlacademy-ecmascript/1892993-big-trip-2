import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeTaskDueDate, DateFormat } from '../utils/util.js';
import flatpickr from 'flatpickr';
import { DefaultPoint } from '../utils/util.js';

import 'flatpickr/dist/flatpickr.min.css';

function createOffferTemplate (offer, checkedOffer) {
  if (offer.length === 0) {
    return '';
  }
  return `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offer.map((item) => (`
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="${item.id}" type="checkbox" name="event-offer-luggage" ${checkedOffer.find((checkedId) => checkedId.id === item.id) ? 'checked' : null}>
                <label class="event__offer-label" for="${item.id}">
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
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-${id}">
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

function createPriceTemplate(id, price = 0) {
  return `<div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
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

function createDetailsTemplate (offer, checkedOffer, description, pictures) {
  const offresTemplate = createOffferTemplate(offer, checkedOffer);
  const descriptionTemplate = createDescriptionTemplate(description);
  const pictureTemplate = createPictureTemplate(pictures);

  if (offer || description || pictures.length){
    return `<section class="event__details">
            ${offresTemplate}
            ${description || pictures.length ? `<section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              ${description ? descriptionTemplate : ''}
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${pictureTemplate}
                </div>
              </div>
            </section>` : ''}
         </section>`;
  } else {
    return '';
  }
}

function createEditEventTemplate(point, offers = [], destinations) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const pointId = point.id || 0;

  const typeOffers = offers.find((offer) => offer.type === point.type)?.offers || [];
  const checkedOffer = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const destination = destinations.find((dest) => point.destination === dest.id) || null;
  const description = destination ? destination.description : '';
  const pictures = destination ? destination.pictures : [];


  const buttonsTemplate = createButtonsTemplate(pointId);
  const priceTemplate = createPriceTemplate(pointId, basePrice);
  const timeTemplate = createTimeTemplate(pointId, dateFrom, dateTo);
  const destinationTemplate = createGroupDestinationTemplate(destinations, type, destination, pointId);
  const typeTemplate = createTypeTemplate(offers, type, pointId);
  const detailsTemplate = createDetailsTemplate(typeOffers, checkedOffer, description, pictures);


  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  ${typeTemplate}

                  ${destinationTemplate}

                  ${timeTemplate}

                  ${priceTemplate}

                  ${buttonsTemplate}
                </header>
                ${detailsTemplate}
              </form>
            </li>`;
}

export default class EditEventView extends AbstractStatefulView {
  #point = null;
  #handleFormSubmit = null;
  #handleFormCloseClick = null;
  #handleDeleteClick = null;
  #destinations = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #offers = null;

  constructor({point = DefaultPoint, offers, destinations, onFormSubmit, onDeleteClick, onFormCloseClick}) {
    super();
    this.#point = point;
    this._setState(EditEventView.parseEditToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCloseClick = onFormCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#offers = offers;
    this.#destinations = destinations;
    this._restoreHandlers();
  }

  get template() {

    return createEditEventTemplate(
      this._state,
      this.#offers,
      this.#destinations,
    );
  }

  reset(event) {
    this.updateElement(
      EditEventView.parseEditToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formFormHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#formClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatepickers();
  }

  #offersChangeHandler = (evt) => {
    if (!this._state.offers.includes(evt.target.id)) {
      this._setState({offers: [...this._state.offers, evt.target.id]});
    } else {
      this._setState({
        offers: this._state.offers.filter((item) => item !== evt.target.id),
      });
    }
  };

  #formFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditEventView.parseStateToEdit(this._state));
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.reset(this.#point);
    this.#handleFormCloseClick();
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({type: evt.target.value, offers: []});
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedName = evt.target.value.trim();
    const selectedDest = this.#destinations.find((dest) => dest.name === selectedName);

    if (selectedDest) {
      this.updateElement({
        destination: selectedDest.id
      });
    } else {
      evt.target.value = this.#destinations[0].name;
    }
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const newPrice = parseInt(evt.target.value, 10) || 0;
    this._setState({ basePrice: newPrice });
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate});
    this.#datePickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({ dateTo: userDate});
    this.#datePickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr': true,
    };

    this.#datePickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo,
      }
    );

    this.#datePickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom,
      }
    );
  };

  removeElement = () => {
    super.removeElement();
    if(this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if(this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditEventView.parseStateToEdit(this._state));
  };

  static parseEditToState(edit) {
    return { ...edit };
  }

  static parseStateToEdit(state) {
    return { ...state };
  }
}
