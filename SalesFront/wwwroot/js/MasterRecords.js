//ApiBackEndUrl = 'https://mlapp.tecnovoz.com.ar:8092/api/';
ApiBackEndUrl = 'https://localhost:44384/api/';
//FrontEnd = 'https://mlapp.tecnovoz.com.ar:8090/';
FrontEnd = 'https://localhost:7119/';

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
        "clienId": 0,
        "firstName": $('#TxtFirstNameCliente').val(),
        "lastName": $('#TxtLastNameIdCliente').val(),
        "email1": $('#TxtEmail1Cliente').val(),
        "email2": $('#TxtEmail2Cliente').val(),
        "phone1": $('#TxtPhone1Cliente').val(),
        "phone2": $('#TxtPhone2Cliente').val(),
        "comment": $('#TxtCommentCliente').val(),
        "documentNumber": "123456",
        "typeDocument": $('#typeDocumentSelect').val(),
        "address": "prueba",
        "nationality": $('#TxtNationalitySelect').val(),
        "insertUser": "Admin",
        "dateinsertUser": new Date(),
        "updateUser": "Admin",
        "dateUpdateUser": new Date()
    });

    obj.data = data;
    console.log(JSON.stringify(data[0]));

    let url = ApiBackEndUrl + 'Clients/insert';

    let response = fetch(url,
        {
            method: 'POST',
            body: {
                client: data[0]
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                alert('Aquí');
            })

}