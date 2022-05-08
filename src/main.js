import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import PointsPresenter from './presenter/points-presenter.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const pointsPresenter = new PointsPresenter(siteHeaderElement, siteMainElement);

render(new FilterView(), siteHeaderControlsElement);

pointsPresenter.init();
