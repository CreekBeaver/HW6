// Boiler Plate Package Requirements.
const express = require('express');
const app = express();
const path = require('path');
var cors = require('cors');
// Set up for Body Parser to parse the Body of the Request.
var bodyParser = require('body-parser');
// Handles x-www-form-urlencoded types
app.use(bodyParser.urlencoded({ extended: false }));
// Handles .json Data
app.use(bodyParser.json());
app.use(cors());
// Boiler Plate Pool Creation ------------
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_creekk',
  password        : '4515',
  database        : 'cs290_creekk'
});
module.exports.pool = pool;

// Handles x-www-form-urlencoded types
app.use(bodyParser.urlencoded({ extended: false }));
// Handles .json Data
app.use(bodyParser.json());
app.set('port', 3000);
//app.set('port', process.argv[2]);

// Handle Get Requests.
app.get('/', (req, res) => {
	console.log('get request recieved');
	// If I get a Request, I Need to send it all the table data.
	var sql = 'SELECT * FROM workouts';
	pool.query(sql, function (err, rows, field) {
		if (err) {
			throw err;
		};
		// The following is going to be used to display table information on the Page.
		var tableInfo = [];
		for (var i in rows) {
			tableInfo.push({'id':rows[i]['id'], 'name':rows[i]['name'],
			'reps':rows[i]['reps'], 'weight':rows[i]['weight'],
			'date': rows[i]['date'], 'lbs':rows[i]['lbs']});
		};
	// Here is the return statement.
	res.send(tableInfo)
	});
});

// Handle Post Requsets.
app.post('/', (req, res) => {
	var sql = "INSERT INTO workouts (name, reps, weight, date, lbs) VALUES ?";
	var values = [[req.body[0], parseInt(req.body[1]), parseInt(req.body[2]), req.body[3], req.body[4]]];
	pool.query(sql, [values], function(err, result) {
		if(err) {
			throw err;
		};
	// After the Data is Added to the Database, It needs to be sent back. 
	var sql2 = 'SELECT * FROM workouts';
	pool.query(sql2, function (err, rows, field) {
		if (err) {
			throw err;
		};
	// The following is going to be used to display table information on the Page.
		var tableInfo = [];
		for (var i in rows) {
			tableInfo.push({'id':rows[i]['id'], 'name':rows[i]['name'],
			'reps':rows[i]['reps'], 'weight':rows[i]['weight'],
			'date': rows[i]['date'], 'lbs':rows[i]['lbs']});
		};
		// I only need to return the Last Item that was placed into the Data Base to Append
		// to the current Table
		var last = tableInfo.pop()
		res.send(last);
	});
});
});

// Handles Delete requested.
app.delete('/', (req, res) => {
	//console.log('here is the request', req.body[0]);
	var sql = "DELETE FROM workouts WHERE id = " + req.body[0];
	//console.log('here is sql', sql);
	// This should delete the value
	pool.query(sql, function(err, result) {
	if(err) {
		throw err;
	};
	});
res.send('Information Deleted');
});

// Handles Update Requests
app.put('/', (req, res) => {
	var sql1 = "UPDATE workouts SET "
	let parameter = req.body[0];
	let value = req.body[1]
	var sql2 = "WHERE id = "
	let id = req.body[2];
	var sqlFinal = sql1 + parameter + "=" + value + sql2 + id;
	pool.query(sqlFinal, function (err, rows, field) {
		if (err) {
			throw err;
		};
	});
	res.send('Table Updated');
});

// The Following Will Reset the Table.
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      console.log('table reset');
    })
  });
});

// Make the Port Listen
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});