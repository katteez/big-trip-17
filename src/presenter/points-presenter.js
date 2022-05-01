import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointsPresenter {
  pointListComponent = new PointListView();

  init = (pointsContainer, offers, points) => {
    this.pointsContainer = pointsContainer;
    this.offers = offers;
    this.points = points;

    render(new SortView(), this.pointsContainer);
    render(this.pointListComponent, this.pointsContainer);
    render(new PointEditView(this.offers, this.points[0]), this.pointListComponent.getElement()); // редактирование точки маршрута
    render(new PointEditView(this.offers), this.pointListComponent.getElement()); // добавление новой точки маршрута

    for(let i = 0; i< this.points.length; i++) {
      render(new PointView(this.points[i]), this.pointListComponent.getElement());
    }
  };
}
