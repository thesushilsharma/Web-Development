(async () => {

    const showNotification = () => {
        const notification = new Notification("**Please Drink Water Now!!", {
            body: "It was reported by the National Academies of Science, Engineering, and Medicine that sufficient daily fluid consumption is: around 15.5 cups (3.7 litres) of men's fluids. Around 2.7 litres (11.5 cups) of fluid a day for women.",
            icon: ""
        });
        // After 3 seconds, close the notification
        setTimeout(() => {
            notification.close();
        }, 3 * 1000);
       
        const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        async function notify() {
            await sleep(3600000);
            showNotification();
        }
        notify();
        notification.onclick = (e) => {
            window.open('https://github.com/thesushilsharma', '_blank');
        };
    }

    const showError = () => {
        const error = document.querySelector('.error');
        error.style.display = 'block';
        error.textContent = "You have blocked the Drink Water Reminder!! Change notifications setting to Allow.";
    }

    let granted = false;

    if (Notification.permission === "granted") {
        granted = true;
    }
    else if (Notification.permission !== "denied") {
        let permission = await Notification.requestPermission();
        granted = permission === 'granted' ? true : false;
    }

    // show notification or error
    granted ? showNotification() : showError();
})();
