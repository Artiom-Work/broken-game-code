'use strict';

const menuSwitcher = document.getElementById('menu-switch');
const mobileMenu = document.querySelector('.mobile-menu__wrapper');
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
		bodyLock();
		menuSwitcher.labels[0].title = 'close';
	} else if (!e.target.checked) {
		bodyUnlock();
		menuSwitcher.labels[0].title = 'mobile menu';
	}
});
mobileMenu.addEventListener('click', (e) => {
	menuSwitcher.checked = false;
	bodyUnlock();
});

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + "px";
	document.body.style.paddingRight = lockPaddingValue;
	document.body.classList.add('lock-body');
}
function bodyUnlock() {
	document.body.style.paddingRight = '0px';
	document.body.classList.remove('lock-body');
}

// -----====== Code for modal window ========----

$("#new-rent").iziModal({
	width: 1074,
	padding: 0,
	focusInput: false,
	overlayColor: 'rgba(49, 47, 47, 0.5)',
	bodyOverflow: true,
});

// ----==== Code for block user-rents (user's reant cards) =====-----
document.addEventListener('DOMContentLoaded', function () {
	// Сюда вы сможете  добавлять запуск функций при прогрузке html элементов на странице
	const form = document.getElementById('new-rent-form');
	const userRentContainer = document.querySelector('.user-rents__list');

	if (userRentContainer) {
		userRentContainer.addEventListener('click', handleCopyText);
	}

	if (form) {
		form.addEventListener('submit', handleFormSubmit);
	}

});

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
// form submit function
function handleFormSubmit(event) {
	event.preventDefault();
	// Здесь можно добавить логику для отправки данных на сервер

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
											<a class="rent-card__button button button--color-red rent-card__button--small-padding" href="#!"
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