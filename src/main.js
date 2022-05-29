import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PagePresenter from './presenter/page-presenter.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const pagePresenter = new PagePresenter(siteHeaderElement, siteHeaderControlsElement, siteMainElement);

render(new NewPointButtonView(), siteHeaderElement);

pagePresenter.init();
