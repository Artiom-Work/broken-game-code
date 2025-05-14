'use strict';

const BACK_END_URL = "http://85.192.56.120:8000/api/v1/rent/";
const decorBlodksOnPage = document.querySelectorAll('.decor-block--on-page');
//=============================================================

// _________GENERAL addEventListener________
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
//=============================================================
//==================Functions==================================
//=============================================================

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
//=============================================================

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
													<span>${endTime}</span>
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
// Create Rent
async function createRent(rentNumber) {
	const data = {
		code: rentNumber
	};

	const response = await fetch(BACK_END_URL + "create_rent", {
		method: 'POST',
		headers: {
			'accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}
async function getRent(rentNumber) {
	// Construct URL with query parameter
	const url = new URL(BACK_END_URL + "rent");
	url.searchParams.append('code', rentNumber);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}
// 1. Функция для получения списка из localStorage по ключу
function getListFromLocalStorage(key) {
	// Получаем данные из localStorage по ключу
	const data = localStorage.getItem(key);

	// Если данные есть - парсим их из JSON и возвращаем
	// Если нет - возвращаем пустой массив
	return data ? JSON.parse(data) : [];
}
// 2. Функция для добавления значения в список по ключу (без дубликатов)
function addItemToLocalStorageList(key, newItem) {
	// Получаем текущий список
	const currentList = getListFromLocalStorage(key);

	// Проверяем, существует ли уже такой элемент в списке
	if (!currentList.includes(newItem)) {
		// Добавляем новый элемент в список, если его еще нет
		currentList.push(newItem);

		// Сохраняем обновленный список обратно в localStorage
		localStorage.setItem(key, JSON.stringify(currentList));

		return true;

	} else {
		return false;
	}
}
// 3. Функция для удаления элемента из списка в localStorage по ключу
function removeItemFromLocalStorageList(key, itemToRemove) {
	// Получаем текущий список
	const currentList = getListFromLocalStorage(key);

	// Проверяем существование элемента в списке
	const itemIndex = currentList.indexOf(itemToRemove);

	if (itemIndex !== -1) {
		// Удаляем элемент из списка
		currentList.splice(itemIndex, 1);

		// Сохраняем обновленный список обратно в localStorage
		localStorage.setItem(key, JSON.stringify(currentList));
		return true;
	}

	// Возвращаем false если элемент не был найден
	return false;
}
// Инциализация аренды по коду
async function init_rent(code) {
	// Нужно сделать проверку есть ли уже такой элемент на странице
	const rent_obj = await getRent(code);

	// Так-как аренда истекла мы убираем её из localstorage
	if (rent_obj.status == "EXPIRED") {
		removeItemFromLocalStorageList('rents', rent_obj.code);
	}

	// Парсим дату с сервера как UTC, добавляя 'Z' при необходимости
	const finishDateStr = rent_obj.finish_date.endsWith('Z')
		? rent_obj.finish_date
		: rent_obj.finish_date.replace(' ', 'T') + 'Z';
	const finishDate = new Date(finishDateStr);

	// Получаем текущее время в UTC
	const now = new Date();

	// Форматируем дату окончания в локальном времени
	const formattedDate = finishDate.toLocaleString('ru-RU', {
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	// Вычисляем оставшееся время в формате "осталось X часов Y минут"
	const timeLeft = finishDate - now;
	const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
	const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

	let timeLeftString = '';
	if (hoursLeft > 0) {
		timeLeftString += `${hoursLeft} час${getHoursWord(hoursLeft)}`;
		if (minutesLeft > 0) {
			timeLeftString += ` ${minutesLeft} минут${getMinutesWord(minutesLeft)}`;
		}
	} else if (minutesLeft > 0) {
		timeLeftString += `Осталось немного: ${minutesLeft} минут${getMinutesWord(minutesLeft)}`;
	} else {
		timeLeftString = 'время истекло';
	}

	// Вспомогательные функции для правильного склонения
	function getHoursWord(hours) {
		if (hours % 10 === 1 && hours % 100 !== 11) return '';
		if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) return 'а';
		return 'ов';
	}

	function getMinutesWord(minutes) {
		if (minutes % 10 === 1 && minutes % 100 !== 11) return 'а';
		if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) return 'ы';
		return '';
	}

	// Размещаем контент на странице
	addRentCard(
		rent_obj.game_name,
		timeLeftString, // Формат: "осталось X часов Y минут"
		formattedDate,  // Формат: "месяц, день, часы:минуты"
		rent_obj.login,
		rent_obj.password,
		rent_obj.steam_guard,
		rent_obj.quick_invite
	);

	// Закрываем модалку
	const emptySection = document.querySelector('.empty');
	const rentsBlock = document.querySelector('.user-rents');
	if (rentsBlock && emptySection) {
		rentsBlock.classList.remove('delete-element');
		emptySection.classList.add('delete-element');
	}
	document.activeElement.blur();
	$('#new-rent').iziModal('close');


}
// Form submit function
async function handleFormSubmit(event) {
	event.preventDefault();
	const rentInput = document.getElementById('rent-number');

	validateUuidV4(rentInput);

	if (!rentInput.checkValidity()) {
		rentInput.reportValidity();
		return;
	}

	const rentNumber = document.getElementById('rent-number').value;

	try {
		// Добавляем await здесь, чтобы дождаться результата
		const response = await createRent(rentNumber);
		console.log(response);

		if (response.status == "NOT_FOUND") {
			alert('Ключ для активации аренды не найден, проверьте его и попробуйте ещё раз!');
			// модалку не убираем, ибо вдруг чел ошибься, меньше действий надо чтобы исправить =)

		} else if (response.status == "STARTED") {
			// Добавляем в localstorage и проверяем есть ли аренда на странице
			let hevent_rent = addItemToLocalStorageList('rents', response.code);
			if (hevent_rent == true) {
				// Вызываем инит аренды
				// Добавляем аренду
				await init_rent(response.code);
			} else {
				alert('Ключ был уже использован.');
				//:todo придумать по лучше
			}
		} else if (response.status == "EXPIRED") {
			alert('Ключ был уже использован.');

		} else if (response.status == "ACCOUNT_NOT_FOUND") {
			alert('Нету доступного аккаунта');
			// todo: Сделать систему брони\возврат

		} else if (response.status == "ERROR") {
			alert('Произошла ошибка при создании аренды.');
		}

	} catch (error) {
		console.error('Ошибка при создании аренды:', error);
		alert('Произошла ошибка при обработке запроса');
	}
}
async function init_rents() {
	const rents = getListFromLocalStorage('rents');
	// todo: Придумать как отображать аренды сразу а не после ответа от сервера
	if (rents.length === 0) {
		const emptyContainer = document.getElementById('empty_container');
		if (emptyContainer) {
			emptyContainer.classList.remove('delete-element');
		}
		return;
	}

	for (const rent of rents) {
		await init_rent(rent);
	}
}

init_rents();

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



