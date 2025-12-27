import FilterView from '../view/filter-view.js';
import TaskControlView from '../view/control-view.js';
import { render } from '../render.js';
import ListEventsView from '../view/list-events.js';
import ItemEventView from '../view/item-event.js';
import EditEventView from '../view/edit-event.js';
export default class BoardPresenter {
  listEventsComponent = new ListEventsView();

  constructor({boardContainer, controlContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.controlContainer = controlContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoint()];
    render(new TaskControlView, this.controlContainer);
    render(new FilterView, this.boardContainer);
    render(this.listEventsComponent, this.boardContainer);
    render(new EditEventView({
      point: this.boardPoints[0],
      checkedOffer: [...this.pointsModel.getOfferById(this.boardPoints[0].type, this.boardPoints[0].offers)],
      offer: this.pointsModel.getOfferByType(this.boardPoints[0].type),
      allOffers: this.pointsModel.getOffer(),
      destination: this.pointsModel.getDestinationById(this.boardPoints[0].destination),
      allDestinations: this.pointsModel.getDestination(),
    }), this.listEventsComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new ItemEventView({
        point: this.boardPoints[i],
        offer: [...this.pointsModel.getOfferById(this.boardPoints[i].type, this.boardPoints[i].offers)],
        destination: this.pointsModel.getDestinationById(this.boardPoints[i].destination),
      }), this.listEventsComponent.getElement());
    }
  }
}
