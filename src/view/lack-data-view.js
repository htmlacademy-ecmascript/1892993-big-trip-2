import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no future events now',
};

function createLackDataTemplate(filterType) {
  const noEventTextValue = NoEventsTextType[filterType];
  return `
  <p class="trip-events__msg">${noEventTextValue}</p>
  `;
}

export default class LackDataView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createLackDataTemplate(this.#filterType);
  }
}
