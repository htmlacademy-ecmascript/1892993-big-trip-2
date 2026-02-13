import { remove, render, RenderPosition } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import EditEventView from '../view/edit-event-view.js';

export default class NewEventPresenter {
  #listEventsComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #eventEditComponent = null;
  #pointsModel = null;

  constructor({listEventsComponent, onDataChange, onDestroy, pointsModel}) {
    this.#listEventsComponent = listEventsComponent;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }
    this.#eventEditComponent = new EditEventView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      offers: this.#pointsModel.getOffer(),
      destinations: this.#pointsModel.getDestination(),
    });
    render(this.#eventEditComponent, this.#listEventsComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent?.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#eventEditComponent.shake(resetFormState);
  }
}
