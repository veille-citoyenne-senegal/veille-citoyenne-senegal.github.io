(function($){

	function setButtonEnableDisable(s) {
		$('#contact-form button').attr('disabled', !s);
	}
	function setWait() {
		var btn = $('#contact-form button');
		btn.empty();
		btn.append('<i class="fa fa-cog fa-spin"></i> Transmission...');
	}
	function setSubmitted(label, msg) {
		var btn = $('#contact-form button');
		btn.empty();
		btn.append('<i class="fa fa-send icon-before"></i> ' + label);
		var txt = $('.response-submit');
		txt.hide().fadeIn(500);
		txt.html(msg);
		setTimeout(function () {txt.fadeOut(1000);}, 5000);
	}
	function setSubmittedWarning(label, msg) {
		var btn = $('#contact-form button');
		btn.empty();
		btn.append('<i class="fa fa-send icon-before"></i> ' + label);
		var txt = $('.response-submit');
		txt.hide().fadeIn(500);
		txt.html('<i class="fa fa-warning"></i> ' + msg);
		setTimeout(function () {txt.fadeOut(1000);}, 5000);
	}
	function setError(msg) {
		var btn = $('#contact-form button');
		btn.empty();
		btn.append('<i class="fa fa-exclamation-triangle icon-before"></i> Erreur');
		var txt = $('.response-submit');
		txt.hide().fadeIn(1000);
		txt.html('<i class="fa fa-warning"></i> ' + msg);
	}
	function create_UUID(){
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	setButtonEnableDisable(false);
	$('input[name="choice"]:checked').prop('checked', false);

	window.addEventListener('load', function() {
		var cookie = false;
		var okToSubmit = false;
		var submitted = true;

		if(window.google_tag_manager) {
			okToSubmit = true;

			Cookies.set('cookie', 'yes');
			if(Cookies.get('cookie') === 'yes') {
				cookie = true;
			} else {
				setButtonEnableDisable(false);
				setError('Merci d\'autoriser les cookies afin de pouvoir transmettre votre choix.');
				window.dataLayer.push({
					'event': 'nocookie'
				});
			}

			var token = Cookies.get('token');
			if(typeof token == 'undefined') {
				if(cookie == true) {
					submitted = false;
				}
			} else {
				setSubmittedWarning('Déjà transmis', 'Un choix a déjà été transmis depuis cet appareil !');
				window.dataLayer.push({
					'event': 'alreadydone',
					'value': token
				});
			}

			$('input[name="choice"]').on("click",function(){
				var radioValue = $("input[name='choice']:checked").val();
				if (cookie && okToSubmit && !submitted) {
					setButtonEnableDisable(true);
				}
			});

			$('#submit').on('click', function(event) {
				event.preventDefault(); // To prevent following the link (optional)
				var radioValue = $("input[name='choice']:checked").val();

				submitted = true;
				setButtonEnableDisable(false);
				setWait();

				window.dataLayer.push({
					'event': 'survey',
					'value': radioValue,
					'eventCallback': function() {
						var id = create_UUID();
						Cookies.set('token', id);
						setTimeout(function () {
							setSubmitted('Transmis', 'Merci d\'avoir utilisé cette plateforme !');
						}, 1500);
					}
				});
			});
		} else {
			setError('Merci d\'autoriser les plugins tiers afin de pouvoir transmettre votre choix.');
		}
	}, false);

})(jQuery);
