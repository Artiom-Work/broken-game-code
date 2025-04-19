'use strict';

const menuSwitcher = document.getElementById('menu-switch');
const mobileMenu = document.querySelector('.mobile-menu__wrapper');
const darkModeBtn = document.querySelector('.night-mode-button');
const decorBlodksOnPage = document.querySelectorAll('.decor-block--on-page');
// Набор переменных для иммитации создания шаблона ( потом удалить )
const gameName = 'GAME_NAME';
const endTime = '2 часа';
const completionTime = '12.12.2012 12:12:12';
const login = 'simple_login';
const password = 'simple_passwd';
const steamGuardCode = 'GDF34';
const friendData = 'Данные из data-атрибута кнопки';
// Variables for background animation
const svg = document.querySelector('.space__layer');
const starsCount = 600; //controll stars quantity

const baseRadius = window.innerWidth <= 767 ? 2.2 : 1.5; // controll stars size
const throttledUpdateAll = throttle(updateAll, 100);
const { viewBoxWidth, viewBoxHeight } = updateViewBox();

let posX = 0, posY = 0;
let targetX = 0, targetY = 0;
//=============================================================
//=============================================================

// _________GENERAL addEventListener________
document.addEventListener('DOMContentLoaded', function () {
	// Сюда вы сможете  добавлять запуск функций при прогрузке html элементов на странице
	const form = document.getElementById('new-rent-form');
	const rentInput = document.getElementById('rent-number');
	const userRentContainer = document.querySelector('.user-rents__list');
	const accordion = document.getElementById('accordion');

	if (accordion) {
		initAccordion();
	}
	if (userRentContainer) {
		userRentContainer.addEventListener('click', handleCopyText);
	}

	if (form) {
		form.addEventListener('submit', handleFormSubmit);
	}

	if (rentInput) {
		setupUuidValidation(rentInput);
	}
});
//=============================================================
//==================Functions==================================
//=============================================================

// -----====== For mobile menu ========----
menuSwitcher.addEventListener('change', (e) => {
	if (e.target.checked) {
		menuSwitcher.labels[0].title = 'close';
	} else if (!e.target.checked) {
		menuSwitcher.labels[0].title = 'mobile menu';
	}
});
mobileMenu.addEventListener('click', () => {
	menuSwitcher.checked = false;
});

// -----====== Code for decor blocks (SVG animated images) ========----

function hiddenDecorImages() {
	if (decorBlodksOnPage) {
		decorBlodksOnPage.forEach(element => {
			element.classList.add('delete-element');
		});
	}
}
function showDecorImages() {
	if (decorBlodksOnPage) {
		decorBlodksOnPage.forEach(element => {
			element.classList.remove('delete-element');
		});
	}
}
// -----====== Code for modal window ========----

$("#new-rent").iziModal({
	width: 1074,
	padding: 0,
	focusInput: false,
	overlayColor: 'rgba(49, 47, 47, 0.5)',
	bodyOverflow: true,
	onOpening: function () {
		document.querySelectorAll('body > :not(#new-rent)').forEach(el => el.classList.add('blurred'));
		document.body.classList.add('lock-body-y');
		hiddenDecorImages();

	},
	onClosed: function () {
		document.body.classList.remove('lock-body-y');
		document.querySelectorAll('body > :not(#new-rent)').forEach(el => el.classList.remove('blurred'));
		showDecorImages();
		document.activeElement && document.activeElement.blur();
	}
});
// ----==== Code for block user-rents (user's reant cards) =====-----

// Function for copy data button in user rent card 
function handleCopyText(event) {
	if (event.target.classList.contains('rent-card__parameter-value--button')) {
		const button = event.target;
		const textToCopy = button.dataset.copyAddToFriends;

		navigator.clipboard.writeText(textToCopy)
			.then(() => {
				button.classList.add('copied-effect');
				setTimeout(() => {
					button.classList.remove('copied-effect');
				}, 4000);
			})
			.catch(err => {
				console.error('Ошибка копирования:', err);
				const textarea = document.createElement('textarea');
				textarea.value = textToCopy;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
				button.classList.add('copied-effect');
				setTimeout(() => {
					button.classList.remove('copied-effect');
				}, 4000);
			});
	}
}

// Function for create template of user rent card
function addRentCard(gameName, endTime, completionTime, login, password, steamGuardCode, friendData) {
	// данные сдесь приходят из переменно , но скорее всего нужно как то отправлять запрос на сервер. если что , шаблон добавления наверно пусть остаётся , а логику работы с сервером я как бы не знаю как вам удобнее будет писать
	const userRentContainer = document.querySelector('.user-rents__list');
	if (userRentContainer) {
		const rentCardHTML = `
					<li class="rent-card">
							<article>
									<h3 class="visually-hidden">Аренда ${gameName}</h3>
									<div class="rent-card__heading">
											<h4 class="rent-card__name">${gameName}</h4>

											<div class="rent-card__remain-time">
													<span>Активна ещё ${endTime}</span>
											</div>
									</div>

									<ul class="rent-card__body">
											<li class="rent-card__parameter">
													<span class="rent-card__parameter-name">Время завершения</span>
													<span class="rent-card__parameter-value">${completionTime}</span>
											</li>
											<li class="rent-card__parameter">
													<span class="rent-card__parameter-name">Логин:</span>
													<span class="rent-card__parameter-value">${login}</span>
											</li>
											<li class="rent-card__parameter">
													<span class="rent-card__parameter-name">Пароль:</span>
													<span class="rent-card__parameter-value">${password}</span>
											</li>
											<li class="rent-card__parameter">
													<span class="rent-card__parameter-name">Steam Guard Code:</span>
													<span class="rent-card__parameter-value">${steamGuardCode}</span>
											</li>
											<li class="rent-card__parameter">
													<span class="rent-card__parameter-name">Для&nbsp;добавления в&nbsp;друзья:</span>
													<button class="rent-card__parameter-value rent-card__parameter-value--button" type="button"
															data-copy-add-to-friends="${friendData}" aria-live="polite" title="Копировать">скопировать</button>
											</li>
									</ul>

									<div class="rent-card__button-group">
											<button class="rent-card__button button" type="button" aria-label="Продлить аренду ${gameName}">Продлить</button>
											<a class="rent-card__button button button--color-red rent-card__button--small-padding" href="problem.html"
													aria-label="Проблема c аккаунтом">Проблема с&nbsp;акком</a>
									</div>
							</article>
					</li>
			`;

		userRentContainer.insertAdjacentHTML('beforeend', rentCardHTML);
	} else {

		console.log('На этой странице нету блока с арендами.');
	}
}
// ----==== Code for form in modal window ====----

// Form submit function 
function handleFormSubmit(event) {
	event.preventDefault();
	// Здесь можно добавить логику для отправки данных на сервер
	const rentInput = document.getElementById('rent-number');
	const userMessage = document.getElementById('user-message');

	validateUuidV4(rentInput);

	if (!rentInput.checkValidity()) {
		rentInput.reportValidity();
		return;
	}

	const emptySection = document.querySelector('.empty');
	const rentsBlock = document.querySelector('.user-rents');

	// Если вдруг понадобится получить данные из формы
	// const rentNumber = document.getElementById('rent-number').value;
	// const userMessage = document.getElementById('user-message').value;

	if (rentsBlock && emptySection) {
		rentsBlock.classList.remove('delete-element');
		emptySection.classList.add('delete-element');
	}
	document.activeElement.blur();
	$('#new-rent').iziModal('close');

	addRentCard(gameName, endTime, completionTime, login, password, steamGuardCode, friendData);

	rentInput.value = '';
	if (userMessage) userMessage.value = '';
	rentInput.setCustomValidity('');
}

//___________ Validation input functions ________
// Handling the input field. ( Setting up validation )
function setupUuidValidation(input) {
	applyUuidV4Mask(input);

	input.addEventListener('input', () => validateUuidV4(input));
	input.addEventListener('invalid', (e) => {
		validateUuidV4(input);
	});
}
// Function of create UUID v4 mask
function applyUuidV4Mask(input) {
	input.addEventListener('input', () => {
		let value = input.value.toLowerCase();
		value = value.replace(/[^0-9a-f]/g, '');

		if (value.length > 8) value = value.slice(0, 8) + '-' + value.slice(8);
		if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
		if (value.length > 18) value = value.slice(0, 18) + '-' + value.slice(18);
		if (value.length > 23) value = value.slice(0, 23) + '-' + value.slice(23);

		if (value.length > 36) value = value.slice(0, 36);

		input.value = value;
	});
}
// Function of validate input ( UUID v4 ) 
function validateUuidV4(input) {
	const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	let errorMessage = '';

	if (input.validity.valueMissing) {
		errorMessage = 'Пожалуйста, заполните это поле.';
	} else if (!uuidV4Regex.test(input.value)) {
		errorMessage = 'Введите корректный UUID v4';
	}

	input.setCustomValidity(errorMessage);
}

// ----==== Code for night mode theme =====-----
//Night theme toggle button behavior
darkModeBtn.onclick = function () {
	darkModeBtn.classList.toggle('night-mode-button--active');
	const isDark = document.body.classList.toggle('dark');

	if (isDark) {
		localStorage.setItem('darkMode', 'dark');
	} else {
		localStorage.setItem('darkMode', 'light');
	}
}
// Check user's theme settings and on correct mode
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	darkModeBtn.classList.add("night-mode--button--active");
	document.body.classList.add("dark");
}
// Check night mode in  localStorage ( to jump to another page )
if (localStorage.getItem('darkMode') === 'dark') {
	darkModeBtn.classList.add('night-mode-button--active');
	document.body.classList.add('dark');
} else if (localStorage.getItem("darkMode") === "light") {
	darkModeBtn.classList.remove("night-mode--button--active");
	document.body.classList.remove("dark");
}

// Theme change function reacting to time of day change ( work only if the user has an OS with automatic theme configuration)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	const newColorShame = e.matches ? "dark" : "light";

	if (newColorShame === "dark") {
		darkModeBtn.classList.add("night-mode--button--active");
		document.body.classList.add("dark");
		localStorage.setItem("darkMode", "dark");
	} else {
		darkModeBtn.classList.remove("night-mode--button--active");
		document.body.classList.remove("dark");
		localStorage.setItem("darkMode", "light");
	}
});

// -----====== For accordions. Pages faq and problem ========----
function initAccordion() {
	$("#accordion").accordion({
		active: 0,
		collapsible: true,
		header: "dt"
	});
}

// ----===== Code For background space paralax animation =====-----

// !IMPORTANT-Function for setting the frequency of function calls( so as not to overload the CPU too much)
function throttle(func, ms) {
	let isThrottled = false;
	let savedArgs;
	let savedThis;

	function wrapper() {
		if (isThrottled) {
			savedArgs = arguments;
			savedThis = this;
			return;
		}

		func.apply(this, arguments);
		isThrottled = true;

		setTimeout(() => {
			isThrottled = false;
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms);
	}

	return wrapper;
}

// Function throttled resize ( so as not to overload the CPU too much)
function updateAll() {
	updateViewBox();
}
window.addEventListener('resize', throttledUpdateAll);

// Function for save viewBox proportion relative to screen for svg background
function updateViewBox() {
	const screenWidth = window.innerWidth;
	const viewBoxWidth = screenWidth <= 767 ? 900 : 1500;
	const aspectRatio = screenWidth / window.innerHeight;
	const viewBoxHeight = viewBoxWidth / aspectRatio;

	svg.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
	return { viewBoxWidth, viewBoxHeight };
}

// Function of generation circles to background svg
for (let i = 0; i < starsCount; i++) {
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	circle.setAttribute('cx', Math.random() * viewBoxWidth);
	circle.setAttribute('cy', Math.random() * viewBoxHeight);
	circle.setAttribute('r', baseRadius + Math.random() * 0.5);
	circle.setAttribute('fill', '#9C92AC');
	circle.style.opacity = 0.05;
	circle.style.animation = `twinkle ${3 + Math.random() * 4}s infinite`;
	circle.style.setProperty('--delay', Math.random() * 5);

	svg.appendChild(circle);
}

// Function for mouse paralax effect
function updateParallax() {
	posX += (targetX - posX) * 0.05;
	posY += (targetY - posY) * 0.05;

	svg.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
	requestAnimationFrame(updateParallax);
}

// Function  tracks changes in the user's mouse position and sets the coordinates for parallax
document.addEventListener('mousemove', (e) => {
	targetX = (e.clientX / window.innerWidth) * 180 - 20;
	targetY = (e.clientY / window.innerHeight) * 180 - 20;
});
updateParallax();