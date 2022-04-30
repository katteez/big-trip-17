import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointsPresenter {
  pointListComponent = new PointListView();

  init = (pointsContainer, pointsModel) => {
    this.pointsContainer = pointsContainer;
    this.pointsModel = pointsModel;
    this.points = [...this.pointsModel.getPoints()];

    render(new SortView(), this.pointsContainer);
    render(this.pointListComponent, this.pointsContainer);
    render(new PointEditView(), this.pointListComponent.getElement());
    render(new AddNewPointView(), this.pointListComponent.getElement());

    for(let i = 0; i< this.points.length; i++) {
      render(new PointView(this.points[i]), this.pointListComponent.getElement());
    }
  };
}
