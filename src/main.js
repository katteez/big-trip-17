import PagePresenter from './presenter/page-presenter.js';

const siteHeaderElement = document.querySelector('.page-header .trip-main');
const siteHeaderControlsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .trip-events');

const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic 5db8rz8f5uwu44f6';

const pagePresenter = new PagePresenter(siteHeaderElement, siteHeaderControlsElement, siteMainElement, END_POINT, AUTHORIZATION);

pagePresenter.init();
