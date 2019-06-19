// DB Connection
const MongoClient = require('mongodb').MongoClient;

// WebDav Server
const webdav = require('webdav-server').v2;
const service = require('./service');
const webdavOwn = require('./WebDav');

// CalDav
const ics = require('ics');

// Config
const config = require('./config/config.js');
const PORT = process.env.PORT || 1900;


// Connection to MongoDB and server initialisation
MongoClient.connect(global.gConfig.database, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    console.log("MongoDB on " + global.gConfig.database + " connected!");
    const dbo = client.db(global.gConfig.dbName);
    startWebDav(dbo);
});

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
        port: PORT
    });


    // initial call of the WebDav structure update
    await updateWebDavStructure();

    // set interval to call update of WebDav structure once every hour
    setInterval(updateWebDavStructure, 3600000);


    // Callback function for WebDav structure update
    async function updateWebDavStructure() {

        let fileStructure = {};
        const users = await service.getUsers(dbo);

        //build file structure
        for (const user of users) {
            let name = user.firstName + '_' + user.lastName + '.json';
            fileStructure[user.insuranceId] = {
                'prescriptions': {
                    'calender': {},
                },
            };
            fileStructure[user.insuranceId][name] = JSON.stringify(user);

            // add prescriptions from the user to the file structure
            let events = [];
            const prescriptions = await service.getPrescriptionsByInsuranceId(dbo, user.insuranceId);
            for (const prescription of prescriptions) {
                fileStructure[user.insuranceId]['prescriptions'][prescription._id + '.json'] = JSON.stringify(prescription);

                // generate iCall events
                let now = new Date();
                for (const t of prescription.time) {
                    for (let i = 0; i<prescription.duration; i++) {
                        const event = {
                            start: [now.getFullYear(), now.getMonth() + 1, now.getDate()+i, t, 0],
                            duration: {hours: 0, minutes: 15},
                            title: 'Medizin einnehmen: ' + prescription.medicine,
                            description: prescription.description,
                            productId: 'AbholthekeCalDav'
                        };
                        events.push(event);
                    }

                }
            }

            //generate iCall files and provide in WebDav
            ics.createEvents(events, (error, value) => {
                if (error) {
                    console.log(error);
                    return
                }
                if (value) {
                    fileStructure[user.insuranceId]['prescriptions']['calender']['medicine.ics'] = value;
                }
            });


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
