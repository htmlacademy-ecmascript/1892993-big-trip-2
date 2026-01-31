import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewEditButtonView from './view/new-edit-button-view.js';
import { render, RenderPosition } from './framework/render.js';

const siteTripEventsElement = document.querySelector('.trip-events');
const siteTripMainControlsElement = document.querySelector('.trip-main__trip-controls');

const pointsModel = new PointModel();
const filterModel = new FilterModel();
const newEditButtonComponent = new NewEditButtonView({
  onClick: handleNewEditButtonClick,
});

const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsElement,
  pointsModel,
  filterModel,
  onNewEditDestroy: handleNewEditFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteTripMainControlsElement,
  filterModel,
  pointsModel,
});

function handleNewEditFormClose() {
  boardPresenter.checkNoEvent();
  newEditButtonComponent.element.disabled = false;
}

function handleNewEditButtonClick() {
  boardPresenter.createEdit();
  newEditButtonComponent.element.disabled = true;
}

render(newEditButtonComponent, siteTripMainControlsElement, RenderPosition.AFTEREND);

filterPresenter.init();
boardPresenter.init();
