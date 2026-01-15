import FilterView from '../view/filter-view.js';
import { render } from '../framework/render.js';
import ListEventsView from '../view/list-events.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils.js';

import LackDataView from '../view/lack-data-view.js';
export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #eventsPresenter = new Map();

  #listEventsComponent = new ListEventsView();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.getPoint()];

    this.#renderBoard();
  }

  #renderNoEvent() {
    render(new LackDataView(), this.#boardContainer);
  }

  #handleModeChange = () => {
    this.#eventsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderItemEvent(pointsModel, point) {
    const eventPresenter = new EventPresenter({
      listEventsComponent: this.#listEventsComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(pointsModel, point);
    this.#eventsPresenter.set(point.id, eventPresenter);
  }

  #renderItemsEvent() {
    render(this.#listEventsComponent, this.#boardContainer);
    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderItemEvent(this.#pointsModel, this.#boardPoints[i]);
    }
  }

  #handleEventChange = (updatedEvent) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedEvent);
    this.#eventsPresenter.get(updatedEvent.id).init(this.#pointsModel, updatedEvent);
  };

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      this.#renderNoEvent();
      return;
    }

    render(new FilterView(), this.#boardContainer);
    this.#renderItemsEvent();
  }
}
