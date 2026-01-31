import { destinations } from '../mocks/destinations.js';
import { offers } from '../mocks/offers.js';
import { points } from '../mocks/points.js';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  points = points;
  offers = offers;
  destinations = destinations;

  getPoint() {
    return this.points;
  }

  getOffer() {
    return this.offers;
  }

  getOfferByType(type) {
    const allOffers = this.getOffer();

    return allOffers.find((offer) => offer.type === type);
  }

  getOfferById(type, itemsId) {
    const offersType = this.getOfferByType(type);

    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }

  getDestination() {
    return this.destinations;
  }

  getDestinationById(id) {
    const allDestinations = this.getDestination();

    return allDestinations.find((item) => item.id === id);
  }

  updatePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.points = [
      ...this.points.slice(0, index),
      update,
      ...this.points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.points = [
      update,
      ...this.points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.points = [
      ...this.points.slice(0, index),
      ...this.points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
