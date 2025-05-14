'use strict';
const accordion = document.getElementById('accordion');
// -----====== For accordions. Pages faq and problem ========----

function initAccordion() {
	$("#accordion").accordion({
		active: 0,
		collapsible: true,
		header: "dt"
	});
}
initAccordion();
