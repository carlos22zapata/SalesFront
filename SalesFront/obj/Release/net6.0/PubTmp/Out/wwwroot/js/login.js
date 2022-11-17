ApiBackEndUrl = 'https://mlapp.tecnovoz.com.ar:8092/api/';
FrontEnd = 'https://mlapp.tecnovoz.com.ar:8090/';
//FrontEnd = 'https://localhost:7119/';

function LogIn(user, password) {
    //alert('{"userName":"' + user.value + '","password":"' + password.value + '"}')
    //var jsonBody = '{"userName":"' + user.value + '","password":"' + password.value + '"}';
    //alert(jsonBody);

    if (user.value == "") {
        $('#lblMessages').html("El nombre de usuario no debe estar vacio !!!");
        $('#lblMessages').show();
        return;
    }
    else if (password.value == undefined) {
        $('#lblMessages').html("La contraseña no debe estar vacía !!!");
        $('#lblMessages').show();
        return;
    }

    var data = {
        "userName": user.value,
        "password": password.value
    }

    
    $.ajax({
        url: ApiBackEndUrl + 'Account',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json",
        type: 'json',
        success: function (jsondata) {

            saveLocalStorage(jsondata);
            console.log("###### successful session !!! ######");

            let getToken = JSON.parse(localStorage.getItem("cazaTokenData"));
            //console.log(getToken["token"]);

            var tt = getToken["token"];

            $("#logInUser").val("");
            $("#logInPass").val("");

            $('#lblMessages').hide();

            var params = {
                token: getToken["token"],
                other_header: 'other_header'
            };

            window.open(FrontEnd + 'Principal', '_self');

        },
        error: function (xhr, status, error) {

            $("#logInUser").val("");
            $("#logInPass").val("");

            $('#lblMessages').html("Usuario o contraseña no validos !!!");
            $('#lblMessages').show();
        },
        catch: function () {
            $('#lblMessages').html("error al consultar la API !!!");
        }
    })
    
}

function saveLocalStorage(data) {
    localStorage.setItem("cazaTokenData", JSON.stringify(data));
}

function startWeb() {
    $.ajax({
        type: "POST",
        url: FactoryX.Urls.ActualizaIp,
        data: {},
        success: (response) => {
            location.reload(true);
            console.log('id del plan asignado correctamenete.');
        },
        error: (response) => {
            location.reload(true);
            console.log("No se pudo asignar el registro.");
        }
    });
}

$(document).ready(function () {
    $("input").focus(function () {

        var eval = $("#logInUser").val();

        if (eval == "") {
            $('#lblMessages').hide();
        }
    });
});