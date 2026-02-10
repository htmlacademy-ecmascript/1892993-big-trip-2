import AbstractView from '../framework/view/abstract-view.js';

function createErrTemplate() {
  return `
  <p class="trip-events__msg">Failed to load latest route information</p>
  `;
}

export default class ErrView extends AbstractView {
  get template() {
    return createErrTemplate();
  }
}
