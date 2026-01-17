import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import ListEventsView from '../view/list-events.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils.js';
import { SortType } from '../const.js';
import { sortByPrice, sortByTime } from '../utils.js';

import LackDataView from '../view/lack-data-view.js';
export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #eventsPresenter = new Map();
  #currentEventType = SortType.DEFAULT;
  #sourcedBoardEvents = [];

  #listEventsComponent = new ListEventsView();
  #sortComponent = null;

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.getPoint()];
    this.#sourcedBoardEvents = [...this.#pointsModel.getPoint()];

    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentEventType === sortType) {
      return;
    }
    this.#sortEvents(sortType);
    this.#clearEventList();
    this.#renderItemsEvent();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortByTime);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardEvents];
    }

    this.#currentEventType = sortType;
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

  #clearEventList() {
    this.#eventsPresenter.forEach((presenter) => presenter.destroy());
    this.#eventsPresenter.clear();
  }

  #handleEventChange = (updatedEvent) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedEvent);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedEvent);
    this.#eventsPresenter.get(updatedEvent.id).init(this.#pointsModel, updatedEvent);
  };

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderItemsEvent();
  }
}
