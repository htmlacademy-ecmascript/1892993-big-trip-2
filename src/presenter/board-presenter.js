import SortView from '../view/sort-view.js';
import { render, remove } from '../framework/render.js';
import ListEventsView from '../view/list-events.js';
import EventPresenter from './event-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortByPrice, sortByTime } from '../utils/util.js';
import { filter } from '../utils/filter-util.js';
import NewEventPresenter from './new-event-presenter.js';

import LackDataView from '../view/lack-data-view.js';
export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #eventsPresenter = new Map();
  #currentEventType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #newEventPresenter = null;
  #listEventsComponent = new ListEventsView();
  #sortComponent = null;
  #noEventsComponent = null;


  constructor({boardContainer, pointsModel, filterModel, onNewEditDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;


    this.#newEventPresenter = new NewEventPresenter({
      listEventsComponent: this.#listEventsComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEditDestroy,
      pointsModel: this.#pointsModel,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentEventType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createEdit() {
    const points = this.points;

    this.#currentEventType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();

    if (points.length === 0) {
      remove(this.#noEventsComponent);
    }
  }

  checkNoEvent() {
    const points = this.points;

    if (points.length === 0) {
      this.#renderNoEvent();
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentEventType === sortType) {
      return;
    }
    this.#currentEventType = sortType;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#boardContainer);
  }


  #renderNoEvent() {
    this.#noEventsComponent = new LackDataView({filterType: this.#filterType});

    render(this.#noEventsComponent, this.#boardContainer);
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderItemEvent(pointsModel, point) {
    const eventPresenter = new EventPresenter({
      listEventsComponent: this.#listEventsComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(pointsModel, point);
    this.#eventsPresenter.set(point.id, eventPresenter);
  }

  #renderItemsEvent() {
    render(this.#listEventsComponent, this.#boardContainer);
    for (let i = 0; i < this.#pointsModel.points.length; i++) {
      this.#renderItemEvent(this.#pointsModel, this.#pointsModel.points[i]);
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();

        this.#renderBoard();

        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventsPresenter.forEach((presenter) => presenter.destroy());
    this.#eventsPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    if (resetSortType) {
      this.#currentEventType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    const points = this.points;

    if (points.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderItemsEvent();
  }
}
