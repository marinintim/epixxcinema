window.onload = function() {

	var templateSeansePopup = document.querySelector('.seanse_popup'),
		underlayPopup = document.querySelector('.underlay_popup');


	var allSeanses = document.querySelectorAll('.js-open-seanse');

	for(var i = 0; i < allSeanses.length; i++) {
		allSeanses[i].addEventListener('click', function() {
			openSeansePopup();
		});
	}


	function openSeansePopup() {
		templateSeansePopup.style.display = 'block';
		templateSeansePopup.style.top = '100px';
		underlayPopup.style.display = 'block';

		// change main information in popup

	}


};
