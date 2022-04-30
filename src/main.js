import TripView from './view/trip-view.js';
import FilterView from './view/filter-view.js';
import { render } from './render.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const pointsModel = new PointsModel();
const pointsPresenter = new PointsPresenter();

render(new TripView(), siteHeaderElement, 'afterbegin');
render(new FilterView(), siteHeaderControlsElement);

pointsPresenter.init(siteMainElement, pointsModel);
