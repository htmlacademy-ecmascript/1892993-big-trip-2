import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/points-model.js';

const siteTripControlElement = document.querySelector('.trip-main__trip-controls');
const siteTripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointModel();


const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventsElement,
  controlContainer: siteTripControlElement,
  pointsModel,
});

boardPresenter.init();
