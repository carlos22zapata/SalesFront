"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(firstName, lastName, dateBirth, typeDocument, documentNumber, userName, emailId, password, roleId, branchesId, chief, isSeller, access, dateDenied) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateBirth = dateBirth;
        this.typeDocument = typeDocument;
        this.documentNumber = documentNumber;
        this.userName = userName;
        this.emailId = emailId;
        this.password = password;
        this.roleId = roleId;
        this.branchesId = branchesId;
        this.chief = chief;
        this.isSeller = isSeller;
        this.access = access;
        this.dateDenied = dateDenied;
    }
}
exports.User = User;
