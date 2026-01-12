import AbstractView from '../framework/view/abstract-view.js';

function createLackDataTemplate() {
  return `
  <p class="trip-events__msg">Click New Event to create your first point</p>
  `;
}

export default class LackDataView extends AbstractView {
  get template() {
    return createLackDataTemplate();
  }
}
