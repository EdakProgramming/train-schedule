// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBpirNypFPI2wCDkQMnEuTI0Z-T1Pwdw-g",
    authDomain: "choo-choo-app.firebaseapp.com",
    databaseURL: "https://choo-choo-app.firebaseio.com",
    projectId: "choo-choo-app",
    storageBucket: "choo-choo-app.appspot.com",
    messagingSenderId: "827659290121"
  };
  firebase.initializeApp(config);
// Variable to reference the database
	var database = firebase.database();

//Initial Values
    var name = "";
    var destination = "";

    var time = 0;
    var frequency = 0;

//Capture Button Click
    $('#Submit-Bttn').on("click", function(e){
        e.preventDefault();
        

//Grab values from input
    var name = $('#name').val().trim(),
        destination = $('#destination').val().trim(),
        time = $('#firstTrain').val().trim(),
        frequency = parseInt($("#frequency").val().trim());
        // console.log(name, destination, time, frequency);

//Push to Firebase
        database.ref().push({
            name : name,
            destination : destination,
            time : time,
            frequency : frequency,
            dateAdded:firebase.database.ServerValue.TIMESTAMP
        })

//Prevent the page from refreshing
        return false;

});


        //Firebase watcher + initial loader

database.ref().on("child_added", function (childAdded) {
    var name = childAdded.val().name;
    var destination = childAdded.val().destination;
    var frequency = childAdded.val().frequency;
    var time = childAdded.val().time;

    //First Time (pushed back 1 year to make sure it comes before current time)
    var timeConverted = moment(time, "HH:mm").subtract(1, "years");
    // console.log(timeConverted);

    //Current Time
    var currentTime = moment();
    console.log("CURRENT TIME : " + moment(
            currentTime).format("hh:mm"));

    //Difference between the times
    var diffTime = moment().diff(moment(
        timeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    //Time apart(remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    //Minutes Until train
    tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    //Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));
    var nexttime = moment(nextTrain).format("hh:mm A");

    var oneRow = "<tr>";
    oneRow += "<td>" + name + "</td>";
    oneRow += "<td>" + destination + "</td>";
    oneRow += "<td>" + frequency + "</td>";
    oneRow += "<td>" + nexttime + "</td>";
    oneRow += "<td>" + tMinutesTillTrain + "</td>";
    oneRow += "</tr>";
    $("#Schedule-Table").append(oneRow);

    //hand the errors
}, function(errorObject){

})


function displayError(error) {
    // console.log(error);

}
//Firebase watcher + initial loader HINT: .on("value")
database.ref().orderByChild("dateAdded").on("child_added", displayError);