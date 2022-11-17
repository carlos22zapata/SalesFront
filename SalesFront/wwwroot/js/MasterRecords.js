ApiBackEndUrl = 'https://mlapp.tecnovoz.com.ar:8092/api/';
FrontEnd = 'https://mlapp.tecnovoz.com.ar:8090/';
//FrontEnd = 'https://localhost:7119/';

var condition = true;

function hideAll() {
    $('.divMaster').hide();
}

function showDiv(div) {
    hideAll();
    $('#' + div).show();
    showMenu();
}

function showMenu() {

    if (condition) {
        $('#first-menu').show(300);
        condition = false;
    }
    else {
        $('#first-menu').hide(300);
        condition = true;
    }
}

function fnBtnClientSave() {

    let data = [];
    var obj = {};

    data.push({
        "FirstName": $('#TxtFirstNameCliente').val(),
        "LastName": $('#TxtLastNameIdCliente').val(),
        "Email1": $('#TxtEmail1Cliente').val(),
        "Email2": $('#TxtEmail2Cliente').val(),
        "Phone1": $('#TxtPhone1Cliente').val(),
        "Phone2": $('#TxtPhone2Cliente').val(),
        "Comment": $('#TxtCommentCliente').val(),
        "TypeDocument": $('#typeDocumentSelect').val(),
        "Nationality": $('#TxtNationalitySelect').val(),
        "Phone2": $('#TxtPhone2Cliente').val(),
        "InsertUser": "Admin",
        "DateinsertUser": "1900/01/01",
        "InsertUser": "Admin",
        "DateinsertUser": "1900/01/01"
    });

    obj.data = data;
    console.log(JSON.stringify(obj));

}