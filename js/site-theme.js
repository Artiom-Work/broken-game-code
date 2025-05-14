'use strict';
const darkModeBtn = document.querySelector('.night-mode-button');

// ----==== Code for night mode theme =====-----
//Night theme toggle button behavior
darkModeBtn.onclick = function () {
	darkModeBtn.classList.toggle('night-mode-button--active');
	const isDark = document.documentElement.classList.toggle('dark');

	if (isDark) {
		localStorage.setItem('darkMode', 'dark');
	} else {
		localStorage.setItem('darkMode', 'light');
	}
}
// Check user's theme settings and on correct mode
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	darkModeBtn.classList.add("night-mode-button--active");
	document.documentElement.classList.add("dark");
}
// Check night mode in  localStorage ( to jump to another page )
if (localStorage.getItem('darkMode') === 'dark') {
	darkModeBtn.classList.add('night-mode-button--active');
	document.documentElement.classList.add('dark');
} else if (localStorage.getItem("darkMode") === "light") {
	darkModeBtn.classList.remove("night-mode-button--active");
	document.documentElement.classList.remove("dark");
}

// Theme change function reacting to time of day change ( work only if the user has an OS with automatic theme configuration)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	const newColorShame = e.matches ? "dark" : "light";

	if (newColorShame === "dark") {
		darkModeBtn.classList.add("night-mode-button--active");
		document.documentElement.classList.add("dark");
		localStorage.setItem("darkMode", "dark");
	} else {
		darkModeBtn.classList.remove("night-mode-button--active");
		document.documentElement.classList.remove("dark");
		localStorage.setItem("darkMode", "light");
	}
});
