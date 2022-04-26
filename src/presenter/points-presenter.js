import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointsPresenter {
  pointListComponent = new PointListView();

  init = (pointsContainer) => {
    this.pointsContainer = pointsContainer;

    render(new SortView(), this.pointsContainer);
    render(this.pointListComponent, this.pointsContainer);
    render(new PointEditView(), this.pointListComponent.getElement());
    render(new AddNewPointView(), this.pointListComponent.getElement());

    for(let i = 0; i< 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  };
}
