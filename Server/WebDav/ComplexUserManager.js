"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleUser_1 = require("./SimpleUser");
var Errors_1 = require("./Errors");
var bcrypt = require('bcryptjs');
var ComplexUserManager = /** @class */ (function () {
    function ComplexUserManager() {
        this.users = {
            __default: new SimpleUser_1.SimpleUser('DefaultUser', null, false, true)
        };
    }
    ComplexUserManager.prototype.getUserByName = function (name, callback) {
        if (!this.users[name])
            callback(Errors_1.Errors.UserNotFound);
        else
            callback(null, this.users[name]);
    };
    ComplexUserManager.prototype.getDefaultUser = function (callback) {
        callback(this.users.__default);
    };
    ComplexUserManager.prototype.addUser = function (name, password, isAdmin) {
        if (isAdmin === void 0) { isAdmin = false; }
        var user = new SimpleUser_1.SimpleUser(name, password, isAdmin, false);
        this.users[name] = user;
        return user;
    };
    ComplexUserManager.prototype.getUsers = function (callback) {
        var users = [];
        for (var name_1 in this.users)
            users.push(this.users[name_1]);
        callback(null, users);
    };
    ComplexUserManager.prototype.getUserByNamePassword = function (name, password, callback) {
        this.getUserByName(name, function (e, user) {
            if (e)
                return callback(e);
            if (bcrypt.compareSync(password, user.password))
                callback(null, user);
            else
                callback(Errors_1.Errors.UserNotFound);
        });
    };
    return ComplexUserManager;
}());
exports.ComplexUserManager = ComplexUserManager;
