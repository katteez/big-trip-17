import { render } from './framework/render.js';
import { generateOffersByAllTypes } from './mock/offers.js';
import { generateFilter } from './mock/filter.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointListPresenter from './presenter/point-list-presenter.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const offers = generateOffersByAllTypes();
const pointsModel = new PointsModel(offers);
const points = pointsModel.points;

const pointListPresenter = new PointListPresenter(siteHeaderElement, siteMainElement, offers, points);

const filters = generateFilter(points);

render(new FilterView(filters), siteHeaderControlsElement);
render(new NewPointButtonView(), siteHeaderElement);

pointListPresenter.init();
