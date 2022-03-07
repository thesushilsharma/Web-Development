// create database connection
var Database_Name = 'mydb';
var Version = '1.0';
var Text_Description = 'Sushil Sharma';
var Database_Size = 5 * 1024 * 1024;
var db = openDatabase(Database_Name, Version, Text_Description, Database_Size);


// create a database
db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS NOTES(topic TEXT, note VARCHAR)");
})

// display if anything available in database
db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM NOTES', [], function (tx, results) {
        var len = results.rows.length, i;

        for (i = 0; i < len; i++) {
            msg = "<p><b>" + results.rows.item(i).topic + "</b><br>" + results.rows.item(i).note + "</p>";
            document.querySelector('#OutputSection').innerHTML += msg;
        }
    }, null);
});

// If user adds a note, add it to the websql
function createTicket() {
    var topic = document.getElementById("topic").value;
    var note = document.getElementById("note").value;
    var validation = /^([^@\s]+@[^@\s]+\.[^@\s]+)$/;

    if (validation.test(topic)) {

        db.transaction(function (tx) {
            tx.executeSql(`INSERT INTO NOTES VALUES("${topic}", "${note}")`);
        });
        createNewNote(topic, note);
    }
    else
        alert("Incorrect email format.");
}

// Function to show elements from websql
function createNewNote(topic, note) {

    var paragraph = document.createElement("p");
    paragraph.innerHTML = `${topic}<br>${note}<br><br>`;
    document.getElementById("OutputSection").appendChild(paragraph);
}

// Function to delete a note
function clearDatabase() {
    document.getElementById("OutputSection").innerHTML = `Empty! Use "Add a Note" section above to add notes.`;
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS NOTES");
        tx.executeSql("CREATE TABLE IF NOT EXISTS NOTES(topic TEXT, note VARCHAR)");
    });

}



/*
Further Features:
1. Add Title
2. Mark a note as Important
3. Delete Individual note
4. Separate notes by user
*/