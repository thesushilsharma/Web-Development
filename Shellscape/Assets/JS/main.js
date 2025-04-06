const outputElement = document.querySelector('#terminal-output');
const inputElement = document.querySelector('#terminal-input');

function commands(commandoutput) {
  outputElement.innerHTML += '<p class="text-red-500 mt-6">visitor@thesushilsharma:~$; ' + inputElement.value + '</p>';
  outputElement.innerHTML += '<p>' + commandoutput + '</p>';
  // Clear input field
  inputElement.value = '';
  window.scrollTo(0, document.documentElement.scrollHeight);
}

document.addEventListener('DOMContentLoaded', function () {
  commands(banner);

  function handleCommand() {

    const command = inputElement.value.trim().toLowerCase();

    switch (command) {
      case "?":
      case "help":
        console.log("help");
        // text = "help info";
        commands(help);
        break;
      case "whoami":
        console.log("whoami");
        commands(whoami);
        //text = "whoami info";
        break;
        case "experience":
        console.log("experience");
        commands(experience);
        //text = "experience info";
        break;
      case "whois":
        console.log("whois");
        commands(whois);
        //text = "whois info";
        break;
      case "education":
        console.log("education");
        commands(education);
        //text = "education info";
        break;
      case "skills":
        console.log("skills");
        commands(skills);
        //text = "skills info";
        break;
      case "hey":
      case "contact":
        console.log("contact");
        commands(contact);
        //text = "contact info";
        break;
      case "banner":
        console.log("banner");
        commands(banner);
        //text = "banner";
        break;
      case "date":
        console.log("date");
        commands(date);
        //text = "date info";
        break;
      case "projects":
        console.log("projects");
        commands(projects);
        setTimeout("window.open('https://github.com/thesushilsharma')", 5000);
        //text = "projects info";
        break;
      case "clear":
        console.log("clear");
        outputElement.innerHTML = '';
        commands(banner);
        //text = "clear info";
        break;
      case "hack":
        console.log("type Sushil");
        commands(hack);
        //text = "skills info";
        break;
      case "sushil":
        //console.log("sushil");
        commands(sushil);
        setTimeout("window.open('https://thesushilsharma.github.io')", 5000);
        //text = "Classified";
        break;
      default:
        console.log("Command not found");
        commands(invalid);
        // text = "Command not found";
        break;
    }
  }

  document.querySelector('#terminal-input').addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      handleCommand();
    }
  });
});