'use strict';

const menuSwitcher = document.getElementById('menu-switch');
const mobileMenu = document.querySelector('.mobile-menu__wrapper');
const darkModeBtn = document.querySelector('.night-mode-button');
// Набор переменных для иммитации создания шаблона ( потом удалить )
const gameName = 'GAME_NAME';
const endTime = '2 часа';
const completionTime = '12.12.2012 12:12:12';
const login = 'simple_login';
const password = 'simple_passwd';
const steamGuardCode = 'GDF34';
const friendData = 'Данные из data-атрибута кнопки';
//==================

// -----====== For mobile menu ========----
menuSwitcher.addEventListener('change', (e) => {
	if (e.target.checked) {
		// bodyLock();
		menuSwitcher.labels[0].title = 'close';
	} else if (!e.target.checked) {
		// bodyUnlock();
		menuSwitcher.labels[0].title = 'mobile menu';
	}
});
mobileMenu.addEventListener('click', () => {
	menuSwitcher.checked = false;
	// bodyUnlock();
});

// function bodyLock() {
// 	const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + "px";
// 	document.body.style.paddingRight = lockPaddingValue;
// 	document.body.classList.add('lock-body');
// }
// function bodyUnlock() {
// 	document.body.style.paddingRight = '0px';
// 	document.body.classList.remove('lock-body');
// }
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
	},
	onClosed: function () {
		document.body.classList.remove('lock-body-y');
		document.querySelectorAll('body > :not(#new-rent)').forEach(el => el.classList.remove('blurred'));
	}
});
// ----==== Code for block user-rents (user's reant cards) =====-----

// copy data button function
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

// Function for create template of user
function addRentCard(gameName, endTime, completionTime, login, password, steamGuardCode, friendData) {
	// данные сдесь приходят из переменно , но скорее всего нужно как то отправлять запрос на сервер. если что , шаблон добавления наверно пусть остаётся , а логику работы с сервером я как бы не знаю как вам удобнее будет писать
	const userRentContainer = document.querySelector('.user-rents__list');
	if (userRentContainer) {
		const rentCardHTML = `
					<li class="rent-card">
							<article>
									<h3 class="visually-hidden">Аренда пользователя</h3>
									<div class="rent-card__heading">
											<h4 class="rent-card__name">${gameName}</h4>

											<div class="rent-card__remain-time">
													<span>Активна ещё ${endTime}</span>
											</div>
									</div>

									<ul class="rent-card__body">
											<li class="rent-card__parameter">
													<h4 class="rent-card__parameter-name">Время завершения</h4>
													<span class="rent-card__parameter-value">${completionTime}</span>
											</li>
											<li class="rent-card__parameter">
													<h4 class="rent-card__parameter-name">Логин:</h4>
													<span class="rent-card__parameter-value">${login}</span>
											</li>
											<li class="rent-card__parameter">
													<h4 class="rent-card__parameter-name">Пароль:</h4>
													<span class="rent-card__parameter-value">${password}</span>
											</li>
											<li class="rent-card__parameter">
													<h4 class="rent-card__parameter-name">Steam Guard Code:</h4>
													<span class="rent-card__parameter-value">${steamGuardCode}</span>
											</li>
											<li class="rent-card__parameter">
													<h4 class="rent-card__parameter-name">Для&nbsp;добавления в&nbsp;друзья:</h4>
													<button class="rent-card__parameter-value rent-card__parameter-value--button" type="button"
															data-copy-add-to-friends="${friendData}" title="Копировать">скопировать</button>
											</li>
									</ul>

									<div class="rent-card__button-group">
											<button class="rent-card__button button" type="button">Продлить</button>
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
// ----==== Code for block user-rents (user's reant cards) =====-----
// GENERAL addEventListener
document.addEventListener('DOMContentLoaded', function () {
	// Сюда вы сможете  добавлять запуск функций при прогрузке html элементов на странице
	const form = document.getElementById('new-rent-form');
	const rentInput = document.getElementById('rent-number');
	const userRentContainer = document.querySelector('.user-rents__list');

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

// ==Form submit function== 
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
		input.reportValidity();
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
	document.body.classList.toggle('dark');
}
