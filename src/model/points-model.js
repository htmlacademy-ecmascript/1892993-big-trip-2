import { destinations } from '../mocks/destinations.js';
import { offers } from '../mocks/offers.js';
import { points } from '../mocks/points.js';

export default class PointModel {
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
}
