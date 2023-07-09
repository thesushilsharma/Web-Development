var Database_Name = 'keeper';
var Version = '1.0';
var Text_Description = 'Sushil Sharma';
var Database_Size = 5 * 1024 * 1024;
var mydb = openDatabase(Database_Name, Version, Text_Description, Database_Size);


//create the  table using SQL for the database using a transaction
mydb.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS NOTES(id INTEGER PRIMARY KEY, topic TEXT, note VARCHAR)");
});

//Function to show elements from websql
function updateNotes(tx, results) {

    var node = document.getElementById("savednotes");
    
    node.innerHTML = "";
    var i;
    var len = results.rows.length;
    //Iterate through the results
    for (i = 0; i < len; i++) {
        //Get the current row from database
        var row = results.rows.item(i);

        node.innerHTML += "<li><p><b>" + row.topic + "</b><br><q>" + row.note + "</q></p><br><button class='bg-black text-white px-4 py-2 rounded' onclick='deleteNote(" + row.id + ");'>Delete Draft</button></li>";
    }
}

//function to display the list of notes in the database
function outputNotes() {

    mydb.transaction(function (tx) {
        tx.executeSql("SELECT * FROM NOTES", [], updateNotes);
    });

}

//If user adds a note, add it to the websql
function createTicket() {

    var topic = document.getElementById("topic").value;
    var note = document.getElementById("note").value;
    var validation = /^([^@\s]+@[^@\s]+\.[^@\s]+)$/;

    if (validation.test(topic)) {
        mydb.transaction(function (tx) {
            tx.executeSql(`INSERT INTO NOTES (topic, note) VALUES("${topic}", "${note}")`);
            outputNotes();
        });
    } else {
        alert("Invalid email");
    }
}

//Function to delete a note
function deleteNote(id) {

    mydb.transaction(function (tx) {
        tx.executeSql("DELETE FROM NOTES WHERE id=?", [id], outputNotes);
    });

}

//Function to delete a table
function clearDatabase() {

    document.getElementById("savednotes").innerHTML = `Empty! Use "Add a Note" section above to add notes.`;
    mydb.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS NOTES");
        tx.executeSql("CREATE TABLE IF NOT EXISTS NOTES(id INTEGER PRIMARY KEY, topic TEXT, note VARCHAR)");
    });

}
outputNotes()

/*
Further Features:
1. Add Title
2. Mark a note as Important
3. Separate notes by user
*/