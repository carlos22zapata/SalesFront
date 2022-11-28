ApiBackEndUrl = 'https://mlapp.tecnovoz.com.ar:8092/api/';
FrontEnd = 'https://mlapp.tecnovoz.com.ar:8090/';

//ApiBackEndUrl = 'https://localhost:44384/api/';
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

    var fName = $('#TxtFirstNameCliente').val();
    var sName = $('#TxtLastNameIdCliente').val();
    var email1 = $('#TxtEmail1Cliente').val();
    var email2 = $('#TxtEmail2Cliente').val();
    var phone1 = $('#TxtPhone1Cliente').val();
    var phone2 = $('#TxtPhone2Cliente').val();
    var comment = $('#TxtCommentCliente').val();
    var documentNumber = $('#TxtDocumCliente').val();
    var typeDocument = $('#typeDocumentSelect').val();
    var address = $('#TxtAdressCliente').val();
    var nationality = $('#TxtNationalitySelect').val();

    if (fName == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el nombre.'
        });
        return;
    }
    else if (sName == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el apellido.'
        });
        return;
    }
    else if (email1 == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir al menos un correo electrónico.'
        });
        return;
    }
    else if (phone1 == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir al menos un teléfono válido.'
        });
        return;
    }
    else if (documentNumber == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir el número de documento.'
        });
        return;
    }

    data.push({
        "clienId": 0,
        "firstName": fName,
        "lastName": sName,
        "email1": email1,
        "email2": email2,
        "phone1": phone1,
        "phone2": phone2,
        "comment": comment,
        "documentNumber": documentNumber,
        "typeDocument": typeDocument,
        "address": address,
        "nationality": nationality,
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
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(data[0])

        })
        .then(
            response => response.json())
        .then(
            result => {
                alert(result);
            });

}