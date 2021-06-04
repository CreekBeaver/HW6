// THe following Function verifies that the input provided is correct.
function inputCheck(inputList){
var statement = true;
// Make sure a Valid Weight Number was input
if (Number.isNaN(inputList[2])) {
//console.log('Not a Valid Weight Type');
statement = false;
};
// Make sure a Valid Reps Number was input.
if (Number.isNaN(inputList[1])) {
//console.log('Not a Valid reps type');
statement = false;
};
// Write Checks to make sure that all forms are complete.
if (inputList[0] == '') {
//console.log('Missing Name');
statement = false;
};
if (inputList[1] == '') {
//console.log('Missing Reps');
statement = false;
};
if (inputList[2] == '') {
//console.log('Missing Weight');
statement = false;
};
if (inputList[3] == '') {
//console.log('Missing date');
statment = false;
};
if (inputList[4] == '') {
//console.log('Missing unit');
statement = false;
};
//console.log(name, reps, weight, date, unit);
return statement
}
function clearFormData() {
document.getElementById('formSubmission').reset();
}

// Below will handle how the buttons are pressed.
document.addEventListener('DOMContentLoaded', bindButton1);
// The following Function will return Form Data
function getFormData() {
	let inputList = []
	inputList.push(document.getElementById('nameInput').value);
	inputList.push(document.getElementById('weightInput').value);
	inputList.push(document.getElementById('repsInput').value);
	inputList.push(document.getElementById('dateInput').value);
	inputList.push(document.getElementById('lbInput').value);
	return inputList
}

function bindButton1(){
	// Create an Event Listener for the 'submit1' Button
	document.getElementById('button1').addEventListener("click", function(event) {
	// Obtain the Inputs from the Form
	var list = getFormData();
	// Verify that the Inputs Are Valid
	var test = inputCheck(list)
	// Case Statement of All Valid Inputs. 
	if (test === true) {

		// Define the Input Data to parse URL
		// let url = [insert server Host]
		let url = 'http://flip2.engr.oregonstate.edu:54426'
		// Send the Request and Capture the Response
		var req = new XMLHttpRequest();
		req.open("POST", url, false);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				let response = JSON.parse(req.responseText);
				// Below will add the newly inserted Value into the List.
				var tableObject = document.getElementById('liftTable').getElementsByTagName('tbody')[0];
				var row = tableObject.insertRow(-1);
				var cell1 = row.insertCell(0);
				cell1.className = 'id';
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				var cell5 = row.insertCell(4);
				var cell6 = row.insertCell(5);
				
				// Below Fabricates the Delete Button
				var cell7 = row.insertCell(6);
				let deleteButton = document.createElement("BUTTON");
				deleteButton.id = response['id'];
				deleteButton.addEventListener("click", function (){
					deleteClicked(this);
				});
				var node = document.createTextNode('Delete');
				deleteButton.appendChild(node);
				cell7.appendChild(deleteButton);
				// End Delete Button Fabrication.
				
				// Below Fabricates the update Button
				var cell8 = row.insertCell(7);
				let updateButton = document.createElement("BUTTON");
				updateButton.addEventListener("click", function (){
					updateClicked(this);
				});
				var node2 = document.createTextNode('Update');
				updateButton.appendChild(node2);
				cell8.appendChild(updateButton);
				// End Update Fabrication
				
				cell1.innerText = response['id'];
				cell2.innerText = response['name'];
				cell3.innerText = response['reps'];
				cell4.innerText = response['weight'];
				cell5.innerText = response['date'];
				cell6.innerText = response['lbs'];
			}
			else {
				console.log("Error in network request: " + req.statusText);
			}
		// End Delete Add Event Listener
		});
		req.send(JSON.stringify(list));
	// End "if test == True"
	};
	// THis will clear the form after the submission button is hit. 
	clearFormData();
	// End Bind Button Add Event Listener
	});
// End Bind Button
};

function deleteClicked(buttonObject){
	let url = 'http://flip2.engr.oregonstate.edu:54426'
	let payload = [buttonObject.id];
	var req = new XMLHttpRequest();
	req.open("DELETE", url, false);
	req.setRequestHeader('Content-Type', 'application/json');
	if(req.status >= 200 && req.status < 400){
		let response = JSON.parse(req.responseText);
		//console.log('here is the response', response);
		}
	req.send(JSON.stringify(payload));
		
	// Below will update the Table after the Delete
	// Get the Table
	var tableObject = document.getElementById('liftTable')
	// Remove the Tbody
	tableObject.removeChild(tableObject.getElementsByTagName('tbody')[0]);
	// Re-estabilsh the body of the Table
	tableObject.appendChild(document.createElement('tbody'));
	// call the load page function
	pageLoad();
}

function updateClicked(buttonObject){
	// The following will handle extracting and obtaining data from the user. 
	console.log('Update Button Clicked');
	
	
	// Below WIll handle Sending the Request to the Server
	//let url = 'http://localhost:3000'
	//let payload = []; // Need to find a way to parse the Payload. 
	//var req = new XMLHttpRequest();
	//req.open("PUT", url, false);
	//req.setRequestHeader('Content-Type', 'application/json');
	//if(req.status >= 200 && req.status < 400){
	//	let response = JSON.parse(req.responseText);
		//console.log('here is the response', response);
	//	}
	//req.send(JSON.stringify(payload));
	
	// Below will update the Table after the Delete
	// Get the Table
	//var tableObject = document.getElementById('liftTable')
	// Remove the Tbody
	//tableObject.removeChild(tableObject.getElementsByTagName('tbody')[0]);
	// Re-estabilsh the body of the Table
	//tableObject.appendChild(document.createElement('tbody'));
	// call the load page function
	//pageLoad();
}

function tableBuild(objects) {
// Get the Table BOdy
var tableObject = document.getElementById('liftTable').getElementsByTagName('tbody')[0];
	for (var i in objects) {
	// Insert thhe rows into the table.
	var row = tableObject.insertRow(i);
	row.name = objects[i]['id'];
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	// Below Fabricates the Delete Button
	var cell7 = row.insertCell(6);
	let deleteButton = document.createElement("BUTTON");
	deleteButton.id = objects[i]['id']
	deleteButton.addEventListener("click", function (){
	deleteClicked(this);
	});
	let node = document.createTextNode('Delete');
	deleteButton.appendChild(node);
	cell7.appendChild(deleteButton);
	// End Delete Button Fabrication.
	
	// Below Fabricates the update Button
	var cell8 = row.insertCell(7);
	let updateButton = document.createElement("BUTTON");
	updateButton.id = objects[i]['id'];
	updateButton.addEventListener("click", function (){
		updateClicked(this);
	});
	var node2 = document.createTextNode('Update');
	updateButton.appendChild(node2);
	cell8.appendChild(updateButton);
	// End Update Fabrication


	cell1.innerText = objects[i]['id'];
	cell1.className = 'id';
	cell2.innerText = objects[i]['name'];
	cell3.innerText = objects[i]['reps'];
	cell4.innerText = objects[i]['weight'];
	cell5.innerText = objects[i]['date'];
	cell6.innerText = objects[i]['lbs'];
};

};
function pageLoad() {
	// Define the Input Data to parse URL
	let url = 'http://flip2.engr.oregonstate.edu:54426'

	// Send the Request and Capture the Response. Then Build the Table to Display on the Screen. 
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			let response = JSON.parse(req.responseText);
			tableBuild(response);
		} 
		else {
			console.log("Error in network request: " + req.statusText);
		}});
		req.send(null);
};
pageLoad();