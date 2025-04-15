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

// -----====== For accordions. Pages faq and problem ========----
$(function () {
	$("#accordion").accordion({
		active: 0,
		collapsible: true,
		header: "dt"
	});
});

// form submit function
function handleFormSubmit(event) {
	event.preventDefault();
	document.activeElement.blur();
	$('#new-rent').iziModal('close');
}