import AbstractView from '../framework/view/abstract-view.js';

function createListEventsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class ListEventsView extends AbstractView {
  get template() {
    return createListEventsTemplate();
  }
}
