//Web Server
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const userRoutes = require('./users/users.routes');
const authenticationRoutes = require('./authentication/authentication.routes');
const prescriptionRoutes = require('./prescriptions/prescriptions.routes');
const pharmaciesRoutes = require('./pharmacies/pharmacies.routes');

//WebDav Server
const webdav = require('webdav-server').v2;
const userService = require('./users/users.service');
const prescriptionService = require('./prescriptions/prescriptions.service');

// Config
const config = require('./config/config.js');


// Connection to MongoDB and server initialisation
MongoClient.connect(global.gConfig.database, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    console.log("MongoDB on " + global.gConfig.database + " connected!");
    app.locals.dbo = client.db(global.gConfig.dbName);
    app.listen(global.gConfig.port, () => {
        console.log('Example app listening on port 3000!');
    });

    startWebDav(app.locals.dbo);
});

app.use(express.json());


// Add Access-Control-Allow-Origin headers to all HTTP requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent, Authorization');
    next();
});

// redirect all API calls to individual routes
app.use('/users', userRoutes);
app.use('/authenticate', authenticationRoutes);
app.use('/prescription', prescriptionRoutes);
app.use('/pharmacies', pharmaciesRoutes);




async function startWebDav(dbo) {

        const server = new webdav.WebDAVServer({
            port: 1900
        });


        // initial update
        await updateWebDavStructure();

        // Callback function for update (every hour)
        async function updateWebDavStructure() {

            let fileStructure = {};
            const users = await userService.getUsers(dbo);


            for (const user of users) {
                let name = user.firstName + '_' + user.lastName + '.json';
                fileStructure[user.insuranceId] = {
                    'prescriptions': {},
                };
                fileStructure[user.insuranceId][name] = JSON.stringify(user);

                const prescriptions = await prescriptionService.getPrescriptionsByInsuranceId(dbo, user.insuranceId);


                for (const prescription of prescriptions) {
                    fileStructure[user.insuranceId]['prescriptions'][prescription._id + '.json'] = JSON.stringify(prescription);
                }

            }

            server.rootFileSystem().addSubTree(server.createExternalContext(), fileStructure);

            console.log('Web Dav structure updated');

        }

        setInterval(updateWebDavStructure, 3600000);


        server.afterRequest((arg, next) => {
            console.log('>>', arg.request.method, arg.fullUri(), '>', arg.response.statusCode, arg.response.statusMessage);
            next();
        });

        server.start(httpServer => {
            console.log('Server started with success on the port : ' + httpServer.address().port);
        });


}
