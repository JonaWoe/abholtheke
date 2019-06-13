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
const webdavOwn = require('./WebDav');

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

    // Create admin:admin user for test purpose
    const userManager = new webdavOwn.ComplexUserManager();
    const user = userManager.addUser('admin', '$2a$10$2Ma6oWwqydXNEAgMjLtwAeQ1IZtL1tHrBG7SN9Fkz6/HntogLsIcW', true);

    // Privilege manager (tells which users can access which files/folders)
    const privilegeManager = new webdav.SimplePathPrivilegeManager();
    privilegeManager.setRights(user, '/', ['all']);

    // Define WebDav server options
    const server = new webdav.WebDAVServer({
        httpAuthentication: new webdav.HTTPBasicAuthentication(userManager, 'Default realm'),
        privilegeManager: privilegeManager,
        port: 1900
    });


    // initial call of the WebDav structure update
    await updateWebDavStructure();

    // set interval to call update of WebDav structure once every hour
    setInterval(updateWebDavStructure, 3600000);


    // Callback function for WebDav structure update
    async function updateWebDavStructure() {

        let fileStructure = {};
        const users = await userService.getUsers(dbo);

        //build file structure
        for (const user of users) {
            let name = user.firstName + '_' + user.lastName + '.json';
            fileStructure[user.insuranceId] = {
                'prescriptions': {},
            };
            fileStructure[user.insuranceId][name] = JSON.stringify(user);

            // add prescriptions from the user to the file structure
            const prescriptions = await prescriptionService.getPrescriptionsByInsuranceId(dbo, user.insuranceId);
            for (const prescription of prescriptions) {
                fileStructure[user.insuranceId]['prescriptions'][prescription._id + '.json'] = JSON.stringify(prescription);
            }

            // add user to userManager and set rights
            const authUser = userManager.addUser(user.insuranceId, user.password, false);
            privilegeManager.setRights(authUser, '/' + user.insuranceId, ['all']);

        }

        // mount virtual created file structure to WebDav server
        server.rootFileSystem().addSubTree(server.createExternalContext(), fileStructure);
        console.log('Web Dav structure updated!');

    }

    // log every Request on WebDav server
    server.afterRequest((arg, next) => {
        console.log('>>', arg.request.method, arg.fullUri(), '>', arg.response.statusCode, arg.response.statusMessage);
        next();
    });

    // start WebDav server
    server.start(httpServer => {
        console.log('Server started with success on the port : ' + httpServer.address().port);
    });
}
