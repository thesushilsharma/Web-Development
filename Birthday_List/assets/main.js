var xhr = new XMLHttpRequest();
xhr.open('GET', 'assets/DOBjson.json');
xhr.onload = function () {
    if (xhr.status === 200) {
        var persons = JSON.parse(xhr.responseText);

        // Loop through each person in the array
        for (var i = 0; i < persons.length; i++) {
            var person = persons[i];

            // Extract birth date value from the person object
            var birthDate = new Date(person.DOB);

            // Format the birth date without the year
            var birthDateWithoutYear = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

            // Calculate the age of the person
            var today = new Date();
            var age = today.getFullYear() - birthDate.getFullYear();
            if (today.getMonth() < birthDate.getMonth() || (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
                age--;
            }

            var wishesHtml = '';
            if (today.getMonth() == birthDate.getMonth() && today.getDate() == birthDate.getDate()) {
                // Generate HTML code for each wish and append to wishesHtml
                wishesHtml = '<span class="text-red-500 font-bold">Today is your birthday. May your birthday be filled with happiness!. Now, You are ' + age + ' years old.</span>';
                
                // Generate HTML code for person's name and wishes
                var personHtml = '<h1 class="text-2xl">' + person.Name + ' (' + birthDateWithoutYear + ')</h1>' + wishesHtml;

                // Append person's HTML code to wishes container
                var wishesContainer = document.getElementById('wishes-container');
                wishesContainer.innerHTML += personHtml;
            }
            // else {
            //     wishesHtml = '<span class="text-blue-500 font-bold">Today is not your birthday. You are ' + age + ' years old.</span>';
            // }

            // Check if the person's birthday is within the current month and not already displayed
            if (birthDate.getMonth() == today.getMonth() && birthDate.getDate() > today.getDate()) {
                var upcomingHtml = '<h2 class="text-2xl">' + person.Name + '\'s birthday is on ' + birthDateWithoutYear + '</h2>';

                // Append upcoming birthday HTML code to upcoming container
                var upcomingContainer = document.getElementById('upcoming-container');
                upcomingContainer.innerHTML += upcomingHtml;
            }
        }
    }
    else {
        console.log('Error retrieving data: ' + xhr.statusText);
    }
};
xhr.send();