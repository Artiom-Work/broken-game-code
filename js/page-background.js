'use strict';
// ----===== Code For background space paralax animation =====-----

// Variables for background animation
const svg = document.querySelector('.space__layer');
const starsCount = 600; //controll stars quantity

const baseRadius = window.innerWidth <= 767 ? 2.2 : 1.5; // controll stars size
const throttledUpdateAll = throttle(updateAll, 100);
const { viewBoxWidth, viewBoxHeight } = updateViewBox();

let posX = 0, posY = 0;
let targetX = 0, targetY = 0;
//=============================================================
//==================Functions==================================
//=============================================================

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
	targetX = (e.clientX / window.innerWidth) * 40 - 20;
	targetY = (e.clientY / window.innerHeight) * 40 - 20;
});
updateParallax();