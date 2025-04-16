'use strict';

const menuSwitcher = document.getElementById('menu-switch');
const mobileMenu = document.querySelector('.mobile-menu__wrapper');
const decorBlodksOnPage = document.querySelectorAll('.decor-block--on-page');
// -----====== GENERAL eventLitener ========----
document.addEventListener('DOMContentLoaded', function () {

	const form = document.getElementById('new-rent-form');

	if (form) {
		form.addEventListener('submit', handleFormSubmit);
	}

});
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
// -----====== For decor blocks (SVG animated images) ========----

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
});
$(document).on('opening', '#new-rent', function (e) {
	hiddenDecorImages();
});
$(document).on('closing', '#new-rent', function (e) {
	showDecorImages();
});

// -----====== Functions for form ========----
// ==Form submit function==
function handleFormSubmit(event) {
	event.preventDefault();
	const rentInput = document.getElementById('rent-number');
	const userMessage = document.getElementById('user-message');

	validateUuidV4(rentInput);

	if (!rentInput.checkValidity()) {
		rentInput.reportValidity();
		return;
	}

	document.activeElement.blur();
	$('#new-rent').iziModal('close');

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



// -----====== For accordions. Pages faq and problem ========----
$(function () {
	$("#accordion").accordion({
		active: 0,
		collapsible: true,
		header: "dt"
	});
});