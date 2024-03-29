var xhr = new XMLHttpRequest();
xhr.open('GET', 'assets/DOBjson.json');
xhr.onload = function () {
    if (xhr.status === 200) {
        var persons = JSON.parse(xhr.responseText);

        // Sort the persons array by month
        persons.sort(function (a, b) {
            var aMonth = new Date(a.DOB).getMonth();
            var bMonth = new Date(b.DOB).getMonth();
            return aMonth - bMonth;
        });

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
            var congratsLink = '';
            if (today.getMonth() == birthDate.getMonth() && today.getDate() == birthDate.getDate()) {
                // Generate HTML code for each wish and append to wishesHtml
                wishesHtml = '<span class="text-red-500 font-bold">Today is your birthday. May your birthday be filled with happiness!. Now, You are ' + age + ' years old.</span>';
                congratsLink = '<a href="https://thesushilsharma.github.io/congrats" class="sm:text-2xl text-xl font-medium text-blue-500 hover:text-blue-900 underline">Congratulations 🎊</a>';

            }
            // else {
            //      wishesHtml = '<span class="text-blue-500 font-bold">Today is not your birthday. You are ' + age + ' years old.</span>';
            // }

            // Generate HTML code for person's name and wishes
            var personHtml = '<h1 class="text-2xl">' + person.Name + ' (' + birthDateWithoutYear + ')</h1>' + wishesHtml + '<br>' + congratsLink;

            // Append person's HTML code to wishes container
            var wishesContainer = document.getElementById('wishes-container');
            wishesContainer.innerHTML += personHtml;

            // Set the birthdate's year to the current year
            birthDate.setFullYear(today.getFullYear());

            // Check if the birth month is within the next 1 month
            var next30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
            if (birthDate >= today && birthDate <= next30Days) {
                // Calculate the difference in days between the birthdate and today's date
                var timeDiff = birthDate.getTime() - today.getTime();
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                // Generate HTML code for upcoming birthday and append to upcoming container
                var upcomingHtml = '<h2 class="text-2xl text-pink-700">' + person.Name + '\'s birthday is on ' + birthDateWithoutYear + '</h2>';
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
