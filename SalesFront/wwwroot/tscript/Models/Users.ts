// models/User.ts
export class User {
    firstName: string;
    lastName: string;
    dateBirth: Date;
    typeDocument: number;
    documentNumber: string;
    userName: string;
    emailId: string;
    password: string;
    roleId: number;
    branchesId: number;
    chief: number;
    isSeller: boolean;
    access: boolean;
    dateDenied: Date;

    constructor(firstName: string,
        lastName: string,
        dateBirth: Date,
        typeDocument: number,
        documentNumber: string,
        userName: string,
        emailId: string,
        password: string,
        roleId: number,
        branchesId: number,
        chief: number,
        isSeller: boolean,
        access: boolean,
        dateDenied: Date) {

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