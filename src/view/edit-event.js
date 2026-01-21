import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeTaskDueDate, DateFormat } from '../utils.js';

function createOffferTemplate (offer, checkedOffer) {
  if (offer.offers.length === 0) {
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

function createPriceTemplate(id, price = 0) {
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

function createDetailsTemplate (offer, checkedOffer, description, pictures) {
  const offresTemplate = createOffferTemplate(offer, checkedOffer);
  const descriptionTemplate = createDescriptionTemplate(description);
  const pictureTemplate = createPictureTemplate(pictures);
  if (offer.offers.length || description || pictures.length){
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

function createEditEventTemplate(point, checkedOffer, offer, allOffers, destination, allDestinations) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const pointId = point.id || 0;
  const description = destination.description;
  const pictures = destination.pictures.length > 0 ? destination.pictures : [];

  const buttonsTemplate = createButtonsTemplate(pointId);
  const priceTemplate = createPriceTemplate(pointId, basePrice);
  const timeTemplate = createTimeTemplate(pointId, dateFrom, dateTo);
  const destinationTemplate = createGroupDestinationTemplate(allDestinations, type, destination, pointId);
  const typeTemplate = createTypeTemplate(allOffers, type, pointId);
  const detailsTemplate = createDetailsTemplate(offer, checkedOffer, description, pictures);


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
  #pointsModel = null;
  #point = null;
  #handleFormSubmit = null;
  #handleFormCloseClick = null;
  #destinations = null;

  constructor({pointsModel, point, onFormSubmit, onFormCloseClick}) {
    super();
    this.#pointsModel = pointsModel;
    this.#point = point;
    this._setState(EditEventView.parseEditToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormCloseClick = onFormCloseClick;
    this.#destinations = this.#pointsModel.getDestination();
    this._restoreHandlers();
  }

  get template() {

    return createEditEventTemplate(
      this._state,
      [...this.#pointsModel.getOfferById(this._state.type, this._state.offers)],
      this.#pointsModel.getOfferByType(this._state.type),
      this.#pointsModel.getOffer(),
      this.#pointsModel.getDestinationById(this._state.destination),
      this.#pointsModel.getDestination(),
    );
  }

  reset(event) {
    this.updateElement(
      EditEventView.parseEditToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formFormHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  }

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

      evt.target.value = '';
    }
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const newPrice = parseInt(evt.target.value, 10) || 0;
    this._setState({ basePrice: newPrice });
  };

  static parseEditToState(edit) {
    return { ...edit };
  }

  static parseStateToEdit(state) {
    return { ...state };
  }
}
