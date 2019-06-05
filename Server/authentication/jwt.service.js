const fs   = require('fs');
const jwt  = require('jsonwebtoken');


// PRIVATE and PUBLIC key
const privateKEY  = fs.readFileSync('./authentication/keystore/private.key', 'utf8');
const publicKEY  = fs.readFileSync('./authentication/keystore/public.key', 'utf8');

const signOptions = {
    issuer:  'Abholtheke',
    subject:  'jw@abholtheke.de',
    audience:  'http://abholtheke.de',
    expiresIn:  "12h",
    algorithm:  "RS256"
};

const verifyOptions = {
    issuer:  'Abholtheke',
    subject:  'jw@abholtheke.de',
    audience:  'http://abholtheke.de',
    expiresIn:  "12h",
    algorithm:  ["RS256"]
};

module.exports = {

    sign: (payload) => {
        return jwt.sign(payload, privateKEY, signOptions);
    },

    verify: (token) => {
        try{
            return jwt.verify(token, publicKEY, verifyOptions);
        }catch (err){
            return false;
        }
    },

    decode: (token) => {
        return jwt.decode(token, {complete: true});
        //returns null if token is invalid
    }
};
