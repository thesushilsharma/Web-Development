function birthday_active(clicked_id) {
	/*Get the ID of the person whose birthdate was hover and display picture.*/
	const birthdayPerson = clicked_id + "-birthday";

	document.getElementById(birthdayPerson).style.filter = "blur(0px)";

	/*unblur the birthday person's image on mouseover*/
	document.getElementById(clicked_id).className = "is-birthday";
}

function birthday_inactive(clicked_id) {
	const birthdayPerson = clicked_id + "-birthday";
	/*blur the birthday person's image on mouseout*/
	document.getElementById(birthdayPerson).style.filter = "blur(5px)";
	document.getElementById(clicked_id).className = "birthday";
}

function birthday_photo_active(clicked_id) {
	/* make the image and information of the hovering individual visible*/
	document.getElementById(clicked_id).style.filter = "blur(0px)";

	/*remove the -birthdate from the element id, leaving only the name.*/
	const birthdate = clicked_id.split("-")[0];
	/*update the birthdate's class to is-birthday*/
	document.getElementById(birthdate).className = "is-birthday";
}

function birthday_photo_inactive(clicked_id) {
	/*on mouseout, blur the person's information and image.*/
	document.getElementById(clicked_id).style.filter = "blur(5px)";
	const birthdate = clicked_id.split("-")[0];
	/*modify the birthdate's class back to the default*/
	document.getElementById(birthdate).className = "birthday";
}
