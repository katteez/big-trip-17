import PagePresenter from './presenter/page-presenter.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const pagePresenter = new PagePresenter(siteHeaderElement, siteHeaderControlsElement, siteMainElement);

pagePresenter.init();
