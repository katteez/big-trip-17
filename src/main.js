import { render } from './framework/render.js';
import { destinations } from './mock/destinations.js';
import { generateOffersByAllTypes } from './mock/offers.js';
import { generateFilter } from './mock/filter.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PagePresenter from './presenter/page-presenter.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const offers = generateOffersByAllTypes();
const pointsModel = new PointsModel(destinations, offers);
const points = [...pointsModel.points];

const pagePresenter = new PagePresenter(siteHeaderElement, siteMainElement, offers, destinations, points);

const filters = generateFilter(points);

render(new FilterView(filters), siteHeaderControlsElement);
render(new NewPointButtonView(), siteHeaderElement);

pagePresenter.init();
