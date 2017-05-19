var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var config = require('./config');
//Need to enter username and password for your database
var connString = config.postgresql;

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({ connectionString: connString },
        function(err, localdb) {
            db = localdb;
            app.set('db', db);

            // db.user_create_seed(function(){
            //   console.log("User Table Init");
            // });
            // db.vehicle_create_seed(function(){
            //   console.log("Vehicle Table Init")
            // });
        })
    //GET

// gets all users
app.get('/api/users', (req, res, next) => {
        db.getUsers((err, users) => {
            if (err) {
                console.log(err);
            }
            res.status(200).send(users);
        })
    })
    // gets all vehicles
app.get('/api/vehicles', (req, res, next) => {
    db.getVehicles((err, vehicles) => {
        if (err) {
            console.log(err);
        }
        res.status(200).send(vehicles);
    })
});
// get vehicle count by userId
app.get('/api/user/:userId/vehiclecount', (req, res, next) => {
    let ownerid = req.params.userId;
    db.getVehicleCount([ownerid], (err, count) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json(count[0]);
    });
});
// get vehicle by userId
app.get('/api/user/:userId/vehicle', (req, res, next) => {
    let ownerid = req.params.userId;
    db.getVehiclesByUserId([ownerid], (err, vehicles) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json(vehicles);
    });
});
// gets vehicles with both users email or begining of first name;
app.get('/api/vehicle', (req, res) => {
    let emailQuery = req.query.UserEmail;
    let userNameStarts = req.query.userFirstStart;
    if (emailQuery) {
        db.getVehicleByEmail([emailQuery], (err, vehicles) => {
            if (err) {
                console.log(err);
            }
            return res.status(200).json(vehicles);
        })
    }
    if (userNameStarts) {
        db.getVehicleByNameStarts([userNameStarts + '%'], (err, vehicles) => {
            if (err) {
                console.log(err);
            }
            return res.status(200).json(vehicles);
        });
    }
});
// get vehicles newer than year 2000.
app.get('/api/newervehiclesbyyear', (req, res) => {
    db.getVehicleByYear((err, vehicles) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json(vehicles);
    })
});

// PUT
// Change onwership of the vehicle
app.put('/api/vehicle/:vehicleId/user/:userId', (req, res) => {
    let vehicleId = req.params.vehicleId;
    let userId = req.params.userId;
    db.changeVehicleOnwership([userId, vehicleId], (err, vehicle) => {
        res.status(200).json(vehicle[0]);
    })

});



//POST

//add a new user
app.post('/api/users', (req, res, next) => {
    let newUser = req.body;
    db.createUser([newUser.firstname, newUser.lastname, newUser.email], (err, user) => {
        if (err) {
            console.log(err);
        }
        res.status(200).send("ok");
    })
});
//add a new vehicle
app.post('/api/vehicles', (req, res, next) => {
    let newVehicle = req.body;
    db.createVehicle([newVehicle.make, newVehicle.model, newVehicle.year, newVehicle.ownerid], (err, vehicle) => {
        if (err) {
            console.log(err);
        }
        res.status(200).send("ok");
    })
});

// DELETE
app.delete('/api/user/:userId/vehicle/:vehicleId', (req, res) => {
    let userId = req.params.userId;
    let vehicleId = req.params.vehicleId;
    db.deleteOwnership([null, vehicleId], (err, user) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json(user);
    })
});

app.delete('/api/vehicle/:vehicleId', (req, res) => {
    let id = req.params.vehicleId;
    db.deleteVehicle([id], (err, vehicle) => {
        res.status(200).json(vehicle);
    })
});

app.listen('3000', function() {
    console.log("Successfully listening on : 3000")
})

module.exports = app;