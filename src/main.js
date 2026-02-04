import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewEditButtonView from './view/new-edit-button-view.js';
import { render, RenderPosition } from './framework/render.js';
import PointsApiService from './api/point-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';
import OfferssApiService from './api/offers-api-service.js';

const AUTHORIZATION = 'Basic sa2sfr33wcr1sa2j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const siteTripEventsElement = document.querySelector('.trip-events');
const siteTripMainControlsElement = document.querySelector('.trip-main__trip-controls');
const pointsModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION),
  offerssApiService: new OfferssApiService(END_POINT, AUTHORIZATION),
});


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

pointsModel.init()
  .finally(() => {
    render(newEditButtonComponent, siteTripMainControlsElement, RenderPosition.AFTEREND);
  });
filterPresenter.init();
boardPresenter.init();
