import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointsPresenter {
  pointListComponent = new PointListView();

  init = (pointsContainer, offersByAllTypes, points) => {
    this.pointsContainer = pointsContainer;
    this.offersByAllTypes = offersByAllTypes;
    this.points = points;

    this.point = this.points[0]; // временно работаем только с первой точкой маршрута из массива точек
    // Получаем только те доп. опции, которые подходят под тип текущей точки маршрута
    this.offersByPointType = offersByAllTypes.find((offer) => offer.type === this.point.type).offers;

    render(new SortView(), this.pointsContainer);
    render(this.pointListComponent, this.pointsContainer);
    render(new PointEditView(this.offersByPointType, this.point), this.pointListComponent.getElement()); // редактирование точки маршрута
    render(new PointEditView(this.offersByPointType), this.pointListComponent.getElement()); // добавление новой точки маршрута

    for(let i = 0; i< this.points.length; i++) {
      render(new PointView(this.points[i], this.offersByPointType), this.pointListComponent.getElement());
    }
  };
}
