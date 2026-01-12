import FilterView from '../view/filter-view.js';
import { render, replace } from '../framework/render.js';
import ListEventsView from '../view/list-events.js';
import ItemEventView from '../view/item-event.js';
import EditEventView from '../view/edit-event.js';
import LackDataView from '../view/lack-data-view.js';
export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];

  #listEventsComponent = new ListEventsView();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.getPoint()];

    this.#renderBoard();
  }

  #renderItemEvent(pointsModel, point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const itemEvent = new ItemEventView({
      pointsModel,
      point,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editEvent = new EditEventView({
      pointsModel,
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormCloseClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    render(itemEvent, this.#listEventsComponent.element);

    function replaceCardToForm() {
      replace(editEvent, itemEvent);
    }

    function replaceFormToCard() {
      replace(itemEvent, editEvent);
    }
  }

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      render(new LackDataView(), this.#boardContainer);
      return;
    }

    render(new FilterView(), this.#boardContainer);
    render(this.#listEventsComponent, this.#boardContainer);
    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderItemEvent(this.#pointsModel, this.#boardPoints[i]);
    }
  }
}
