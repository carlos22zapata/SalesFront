import { strict } from "assert";
import { Console, error } from "console";
//import "jquery";
//import * as bootstrap from "bootstrap";
//import require from "node:stream/consumers";
declare let Swal: any;
declare let moment: any;
declare let require: any;
declare let $: any;



//declare let links: linksApi;

//#region comandos utilidades
/*   
    Comandos TypeScript
        tsc --w (watch cambios en tiempo real en el archivo js al guardar el ts)
        tsc --init (inicia el proyecto de Typescript)
        npm ls (equivalente al dir)
        npm install <nombre> --save (instalar componente)
        npm unininstall <nombre> --save (desinstalar componente)

*/
//#endregion comandos TypeScript

var ApiBackEndUrl: string = "https://mlapp.tecnovoz.com.ar:8092/api/";
//var FrontEnd = "https://mlapp.tecnovoz.com.ar:8090/";

//var ApiBackEndUrl = "https://localhost:44384/api/";
var FrontEnd: string = "https://localhost:7119/";

//var ApiBackEndUrl: string = "https://mlapp.tecnovoz.com.ar:8095/api/";

/*
 ##########################################################
 ################### Funciones generales ##################
 ##########################################################
 */

//#region Funciones generales

//Función para cargar todos los select
async function fnLoadSelect(nameControl: string, url: string) {
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    nameControl = '#' + nameControl;
    var selectControl = $(nameControl);

    //alert(selectControl[0].childNodes.length);

    if (selectControl[0].childNodes.length > 1)
        return;

    url = ApiBackEndUrl + url;

    let response = await fetch(url,
        {
            method: 'GET',
            headers: {
                page: "1",
                pageSize: "1000",
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            async result => {

                selectControl.empty();
                var cont = 0;

                for (var j in result) {
                    //selSellers.append(result[cont].sellerId)

                    var option = $(document.createElement("option"));

                    switch (url) {
                        case ApiBackEndUrl + 'Clients/GetClients':
                            option.val(result[cont].id);
                            option.text(result[cont].firstName + " " + result[cont].lastName);
                            break;
                        case ApiBackEndUrl + 'Channels/GetChannels':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
                            break;
                        case ApiBackEndUrl + 'Branches/GetBranches':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
                            break;
                        case ApiBackEndUrl + 'Coins/GetCoins':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
                            break;
                        case ApiBackEndUrl + 'Sellers/GetSellers': //Pendiente que este ya no se usa, los vendedores pasan a ser los usuarios registrados
                            option.val(result[cont].id);
                            option.text(result[cont].firstName + " " + result[cont].lastName);
                            break;
                        case ApiBackEndUrl + 'Products/GetProducts':
                            await option.val(result[cont].id);
                            await option.text(result[cont].productName);

                            ////Para el caso de los renglones de los productos
                            //if ($('#SelectSaleDeailProduct').val() != null && $('#SelectSaleDeailProduct').val() == 1) {
                            //    fnChangeSelect();
                            //}
                            
                            break;
                        case ApiBackEndUrl + 'Destinations/GetDestinationsCountries':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
                            break;
                        case ApiBackEndUrl + 'Destinations/GetDestinationsProvinces':
                            option.val(result[cont].id);
                            option.text(result[cont].provinceName);
                            break;
                        case ApiBackEndUrl + 'Account/GetUserSeller':
                            option.val(result[cont].userId);
                            option.text(result[cont].firstName + " " + result[cont].lastName);
                            break;
                        default:
                    }

                    selectControl.append(option);
                    cont++;
                }

                //Para colocar el valor por defecto en el control
                if (url == ApiBackEndUrl + 'Account/GetUserSeller') {
                    selectControl.val(JSON.parse(dataWeb).userId);
                }
                else if (url == ApiBackEndUrl + 'Branches/GetBranches') {
                    selectControl.val(JSON.parse(dataWeb).BranchId);
                }
                else if (url == ApiBackEndUrl + 'Coins/GetCoins') {
                    selectControl.val(1);
                }
                

            });
}

function showDiv(divSelPrincipal:string) {
    hideAll();
    $('#' + divSelPrincipal).show();

    if (divSelPrincipal == "MasterClients")
        fnLoadClients();
    if (divSelPrincipal == "MasterSellers")
        fnLoadSellers(1, 5);
    if (divSelPrincipal == "MasterSales")
        fnLoadSales(1, 5);
    if (divSelPrincipal == "MasterProducts")
        fnLoadProducts();

    showMenu();
}

//Función encargada de abrir y cerrar el contenido del menú principal
function fnExpandMenu(n: number) {
    if (n == 1) {
        if ($('#menu-principal-1').is(":visible"))
            $('#menu-principal-1').hide(100);
        else {
            $('#menu-principal-1').show(100);
            $('#menu-principal-2').hide(100);
            $('#menu-principal-3').hide(100);
        }
    }
    else if (n == 2) {
        if ($('#menu-principal-2').is(":visible"))
            $('#menu-principal-2').hide(100);
        else {
            $('#menu-principal-1').hide(100);
            $('#menu-principal-2').show(100);
            $('#menu-principal-3').hide(100);
        }
    }
    else {
        if ($('#menu-principal-3').is(":visible"))
            $('#menu-principal-3').hide(100);
        else {
            $('#menu-principal-1').hide(100);
            $('#menu-principal-2').hide(100);
            $('#menu-principal-3').show(100);
        }
    }
}

function showMenu() {
    if ($("#first-menu").is(":visible")) {
        $("#first-menu").hide(100);
    } else {
        $("#first-menu").show(100);
    }
}

function hideAll() {
    $('.divMaster').hide();
}

//#endregion Funciones generales

/*
 ##########################################################
 ########################## Login #########################
 ##########################################################
 */

//#region Sección de Login

function LogIn(user: string, password: string) {

    if (user == "") {
        $('#lblMessages').html("El nombre de usuario no debe estar vacio !!!");
        $('#lblMessages').show();
        return;
    }
    else if (password == undefined) {
        $('#lblMessages').html("La contraseña no debe estar vacía !!!");
        $('#lblMessages').show();
        return;
    }

    let url = ApiBackEndUrl + 'Account/GetTokenUser';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                passwordLogin: password,
                userLogin: user
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                sessionStorage.setItem("TecnoData", JSON.stringify(result));
                //var dataWeb:any = sessionStorage.getItem("TecnoData");
                //alert(JSON.parse(dataWeb).RoleName);

                $('#datosLogIn').hide();
                $('#datosLogInSucursal').show();

                fnSelectUserBranch();

            })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'No se acceder a la API!',
                text: 'Hubo un error: ' + error
            });
        });

}

async function LogInSucursal() {
    const principalWeb: string = FrontEnd + 'Principal';

    var SelectUserBranch = $('#SelectUserBranch');
    var BrnchId = SelectUserBranch.val();

    if (BrnchId == "" || BrnchId == null || BrnchId == undefined) {
        Swal.fire({
            icon: 'error',
            title: 'Debe seleccionar un registro para continuar',
            text: 'Consulte con el administrador del sistema sobre esto.'
        });

        return;
    }

    var BrnchName = SelectUserBranch.find('option:selected').text();

    sessionStorage.setItem("TecnoBranchId", BrnchId);
    sessionStorage.setItem("TecnoBranchName", BrnchName);
    await window.open(principalWeb, '_self');

}

//function fnReadLinks() {
//    const config = require("./build/config.json");
//    var f: string = config.LinkAccess.FrontEnd;
//    console.log(f);
//}

function fnSelectUserBranch() {

    var dataWeb:any = sessionStorage.getItem("TecnoData");                
    var userId: string = JSON.parse(dataWeb).userId;
    
    if (userId == null || userId == "" || userId == undefined) {
        Swal.fire({
            icon: "error",
            title: "Inicie sesión nuevamente",
            text: "Debe volver a iniciar sesión con su usuario y clave para poder seleccionar una sucursal!!!"
        });
        return;
    }
    else {
        let url = ApiBackEndUrl + 'Account/GetUserBranch';

        let response = fetch(url,
            {
                method: 'GET',
                headers: {
                    UserId: userId.toString(),
                    Authorization: JSON.parse(dataWeb).token
                }
            })
            .then(
                response => response.json())
            .then(
                result => {
                    var SelectUserBranch = $('#SelectUserBranch');
                    SelectUserBranch.empty();

                    for (var j in result) {
                        var option = $(document.createElement("option"));
                        option.val(result[j].BranchesId);
                        option.text(result[j].Description)
                        SelectUserBranch.append(option);
                    }

                    SelectUserBranch.val(JSON.parse(dataWeb).BranchId);                                     
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo completar la operación!',
                    text: 'Hubo un error: ' + error
                });
            });
    }
    
}

//#endregion Sección de Login


/*
 ##########################################################
 ####################### Productos ########################
 ##########################################################
 */

//#region Sección de Productos

function fnAddProduct() {
    $('#ModalProducts').modal('show');
}

function fnLoadProducts() {

    let url = ApiBackEndUrl + 'Products/GetProducts';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionProducts();
    var skip = position[0];
    var take = position[1];

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                page: skip.toString(),
                pageSize: take.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabProductsT > tbody").empty();

                var cont = 0;

                for (var j in result) {

                    var newRow = document.createElement("tr");

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].id;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsProducts").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].productName;
                    newRow.append(newCell);
                    $("#rowsProducts").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].price;
                    newRow.append(newCell);
                    $("#rowsProducts").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnProductDelete");
                    btn1.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnProductDelete(' + result[cont].id + ')')

                    var btn2 = document.createElement("btnProductUpdate");
                    btn2.innerHTML = '<i class="fa-solid fa-pencil"></i>';
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnProductUpdate(' + result[cont].id + ')')

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsProducts").append(newRow);
                    //##################################

                    cont++;
                }
                //console.log(result);

                $('#spinnerProducts').hide();
            });
}

function fnPositionProducts() {
    let Position = $('#ProductsNPosition').val();
    let Records = $('#selDataProductsGroup').html();
    return [Position, Records];
}

function fnProductDelete(id:number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro con id: "' + id + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
            if (result.isConfirmed) {

                let url = ApiBackEndUrl + 'Products/deleteProduct';

                let response = fetch(url,
                    {
                        method: 'DELETE',
                        headers: {
                            id: id.toString()
                        }
                    })
                    .then(response => response.json())
                    .then(
                        result => {

                            if (result == true) {

                                fnLoadProducts();

                                Swal.fire(
                                    'Borrado!',
                                    'Registro borrado satisfactoriamente.',
                                    'success'
                                );
                            }
                            else {
                                Swal.fire(
                                    'Se detecto un error!',
                                    'el archivo no pudo ser borrado.',
                                    'error'
                                )
                            }


                        })
                    .catch(error => {
                        Swal.fire(
                            'Se detecto un error!',
                            'Error en la solicitud al sitio remoto (API).',
                            'error'
                        )
                    });


            }
        });    
}

function fnProductUpdate(id: number) {

}

function fnChangeDataGroupProducts(num: number) {
    $('#selDataProductsGroup').html(num);
    fnCleanProducts();
    fnLoadProducts();
}

function fnBtnSaveProduct() {
    let data = [];
    var obj = {};
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    var ProductName = $('#TxtProductDescription').val();
    var ProductPrice = $('#TxtProductPrice').val();
        
    if (ProductName == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el nombre del producto'
        });
        return;
    } else if (ProductPrice == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Coloque un costo'
        });
        return;
    }

    data.push({
        "Id": 0,
        "productName": ProductName,
        "price": ProductPrice, 
        "relatedTo": "C",
        "insertUser": (JSON.parse(dataWeb).userId).toString(),
        "dateInsertUser": new Date()
    });

    //console.log(JSON.stringify(data[0]));

    let url = ApiBackEndUrl + 'Products/insertProduct';


    let response = fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: JSON.parse(dataWeb).token
            },
            body: JSON.stringify(data[0])

        })
        .then(
            response => response.json())
        .then(
            result => {
                Swal.fire({
                    icon: 'info',
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guardó correctamente el registro'
                });

                fnCleanProducts();
                fnLoadProducts();
            })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar el registro',
                text: 'Hubo un error al intentar guardar el registro, error: ' + error
            });
        });
}

function fnBtnUpdateProduct() {

}

function fnCleanProducts() {
    $('#TxtProductDescription').val("");
    $('#TxtProductPrice').val("");
}

//#endregion Sección de Productos


/*
 ##########################################################
 ######################## Clientes ########################
 ##########################################################
 */

//#region Sección de Clientes

function fnAddClient() {
    fnCleanClient();
    $('#ModalClients').modal('show');
}

function fnLoadClients() { //skip: number, take: number) {

    let url = ApiBackEndUrl + 'Clients/GetClients';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionClient();
    var skip = position[0];
    var take = position[1];

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                page: skip.toString(),
                pageSize: take.toString(),
                Authorization: JSON.parse(dataWeb).token                
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabClientsT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].id;
                    var name_ = result[cont].firstName;
                    var lName_ = result[cont].lastName;
                    var email1 = result[cont].email1;                    
                    var phone1 = result[cont].phone1;
                    var tDocument = result[cont].typeDocument;
                    var document_ = result[cont].documentNumber;

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = name_;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = lName_;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = email1;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = phone1;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = tDocument;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = document_;
                    newRow.append(newCell);

                    var btn = document.createElement("BUTTON");
                    btn.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i>';
                    btn.classList.add("btnGrid");
                    btn.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')
                    var newCell = document.createElement("td");
                    newCell.appendChild(btn);
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    cont++;
                }

                //console.log(result);
                $('#spinnerClients').hide();
            });
}

function fnCleanClient() {
    $('#TxtFirstNameCliente').val('');
    $('#TxtLastNameIdCliente').val('');
    $('#TxtEmail1Cliente').val('');
    $('#TxtEmail2Cliente').val('');
    $('#TxtPhone1Cliente').val('');
    $('#TxtPhone2Cliente').val('');
    $('#TxtCommentCliente').val('');
    $('#TxtDocumCliente').val('');
    $('#typeDocumentSelect').val('DNI');
    $('#TxtAdressCliente').val('');
    $('#TxtNationalitySelect').val('Argentina');

    $('#SellerSelectClient').empty();
    fnLoadSelect('SellerSelectClient', 'Account/GetUserSeller');
}

function fnSearchAdvancedClient() {
    var adv = $('#divSearchClientAdvanced').is(':hidden');

    if (adv) {
        $('#divSearchClientAdvanced').show();
        $('#divSearchClient').hide();
    }
    else {
        $('#divSearchClientAdvanced').hide();
        $('#divSearchClient').show();
    }

}

function fnSearchClient() {
    var position = fnPositionClient();
    var select = "select top " + position[1] + " * from Clients ";

    if ($("#divSearchClientAdvanced").is(":visible")) { //Si esta visible la busqueda avanzada
        var fName: string = $('#TxtFirstNameClientAdvanced').val();
        var lName: string = $('#TxtLastNameIdClientAdvanced').val();
        var eMail1: string = $('#TxtEmail1ClientAdvanced').val();
        var eMail2: string = $('#TxtEmail2ClientAdvanced').val();
        var phone1: string = $('#TxtPhone1ClientAdvanced').val();
        var phone2: string = $('#TxtPhone2ClientAdvanced').val();
        var pDocument: string = $('#TxtDocumClientAdvanced').val();

        if (fName + lName + eMail1 + eMail2 + phone1 + phone2 + pDocument == "") {
            //select = select;
            fnLoadClients();
            return;
        }
        else {
            select = select + "where ";

            if (fName != "") {
                select += "FirstName like('%" + fName + "%') ";
            }

            if (lName != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "LastName like('%" + lName + "%') ";
            }

            if (eMail1 != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "Email1='" + eMail1 + "' ";
            }

            if (eMail2 != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "Email2='" + eMail2 + "' ";
            }

            if (phone1 != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "Phone1='" + phone1 + "' ";
            }

            if (phone2 != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "Phone2='" + phone2 + "' ";
            }

            if (pDocument != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "DocumentNumber='" + pDocument + "' ";
            }

        }
    }
    else { //Busqueda básica

        var fName: string = $('#TxtFirstNameClientBasicSearch').val();
        var lName: string = $('#TxtLastNameIdClientBasicSearch').val();
        var pDocument: string = $('#TxtDocumClientBasicSearch').val();

        if (fName + lName + pDocument == "") {
            //select = select;
            fnLoadClients();
            return;
        }
        else {
            select = select + "where ";

            if (fName != "") {
                select += "FirstName like('%" + fName + "%') ";
            }

            if (lName != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "LastName like('%" + lName + "%') ";
            }

            if (pDocument != "") {
                if (select.substr(-6) != "where ")
                    select += "and "

                select += "DocumentNumber='" + pDocument + "' ";
            }

        }
    }

        console.log(select);

        var skip: number = 0;
        var take: number = 100;

        let url = ApiBackEndUrl + 'Clients/DynamicGetClientsSelect';
        var dataWeb: any = sessionStorage.getItem("TecnoData");

        let response = fetch(url,
            {
                method: 'GET',
                headers: {
                    select: select.toString(),
                    Authorization: JSON.parse(dataWeb).token
                }
            })
            .then(
                response => response.json())
            .then(
                result => {

                    $("#TabClientsT > tbody").empty();
                    var cont = 0;

                    for (var j in result) {

                        var id_ = result[cont].id;
                        var name_ = result[cont].firstName;
                        var lName_ = result[cont].lastName;
                        var email1 = result[cont].email1;
                        var phone1 = result[cont].phone1;
                        var tDocument = result[cont].typeDocument;
                        var document_ = result[cont].documentNumber;

                        var newRow = document.createElement("tr");
                        var newCell = document.createElement("td");
                        newCell.innerHTML = id_;
                        newRow.append(newCell);
                        newCell.style.display = 'none';
                        $("#rowsClient").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = name_;
                        newRow.append(newCell);
                        $("#rowsClient").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = lName_;
                        newRow.append(newCell);
                        $("#rowsClient").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = email1;
                        newRow.append(newCell);
                        $("#rowsClient").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = phone1;
                        newRow.append(newCell);
                        $("#rowsClient").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = tDocument;
                        newRow.append(newCell);
                        $("#rowsClient").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = document_;
                        newRow.append(newCell);

                        var btn = document.createElement("BUTTON");
                        btn.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i>';
                        btn.classList.add("btnGrid");
                        btn.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')
                        var newCell = document.createElement("td");
                        newCell.appendChild(btn);
                        newRow.append(newCell);
                        $("#rowsClient").append(newRow);

                        cont++;
                    }

                    //console.log(result);
                    $('#spinnerClients').hide();
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'No se acceder a la API!',
                    text: 'Hubo un error: ' + error
                });
            });    
    //fnCleanClient();
    //fnLoadClients(position[0], position[1]);
}

function fnSalesClient(id:number, name_:string, document_:number) {
    $('#ModalClients_Sales').modal('show');
    $('#idClient_Sales').html(id);
    $('#nameClient_Sales').html(name_);
    $('#documentClient_Sales').html(document_);
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
    var sellersId = $('#SellerSelectClient').val();

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
    else if (sellersId == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir el vendedor.'
        });
        return;
    }

    data.push({
        "id": 0,
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
        "sellersId": sellersId,
        "insertUser": "Admin",
        "dateInsertUser": new Date(),
        "updateUser": "Admin",
        "dateUpdateUser": new Date()
    });

    //obj.data = data;
    //console.log(JSON.stringify(data[0]));

    let url = ApiBackEndUrl + 'Clients/insertClient';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: JSON.parse(dataWeb).token
            },
            body: JSON.stringify(data[0])

        })
        .then(
            response => response.json())
        .then(
            result => {
                Swal.fire({
                    icon: 'info',
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guardó correctamente el registro'
                });

                //var position = fnPositionClient();

                fnCleanClient();
                fnLoadClients();
            });

}

function fnPositionClient() {
    let Position = $('#ClientsNPosition').val();
    let Records = $('#selDataGroup').html();
    return [Position, Records];
}

function fnShowPositionClients() {

} 

function fnChangeDataGroupClients(num: number) {
    $('#selDataGroup').html(num);
    fnCleanClient();
    fnLoadClients();
}

//#endregion Sección de Clientes


/*
 ##########################################################
 ####################### Vendedores #######################
 ##########################################################
 */

//#region Sección de Vendedores

function fnLoadSellers(page: number, pageSize: number) {

    let url = ApiBackEndUrl + 'Sellers/GetSellers';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                page:     page.toString(),
                pageSize: pageSize.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabSellersT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].id;
                    newRow.append(newCell);
                    $("#rowsSellers").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].firstName;
                    newRow.append(newCell);
                    $("#rowsSellers").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].lastName;
                    newRow.append(newCell);
                    $("#rowsSellers").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].email;
                    newRow.append(newCell);
                    $("#rowsSellers").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].typeDocument;
                    newRow.append(newCell);
                    $("#rowsSellers").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].documentNumber;
                    newRow.append(newCell);
                    $("#rowsSellers").append(newRow);

                    cont++;
                }

                //console.log(result);
            });
}

function fnAddSeller() {
    $('#Modalsellers').modal('show');
}

function fnCleanSeller() {
    $('#TxtIdSeller').val('');
    $('#TxtFirstNameSeller').val('');
    $('#TxtLastNameSeller').val('');
    $('#TxtEmailseller').val('');
    $('#TxtDateSeller').val(Date.now());
    $('#typeDocumentSelectSeller').val('DNI');
    $('#TxtDocumSeller').val('');
    $('#TxtCommentSeller').val('');
    $('#TxtBranchSeller').val('');
}

function fnSearchAdvancedSeller() {
    var adv = $('#divSearchAdvancedSeller').is(':hidden');

    if (adv) {
        $('#divSearchAdvancedSeller').show();
        $('#divSearchSeller').hide();
    }
    else {
        $('#divSearchAdvancedSeller').hide();
        $('#divSearchSeller').show();
    }
}

function fnBtnSaveSeller() {

    let data = [];
    var obj = {};

    var fName = $('#TxtFirstNameSeller').val();
    var sName = $('#TxtLastNameSeller').val();
    var email1 = $('#TxtEmailseller').val();
    var dateB = $('#TxtDateSeller').val();
    var typeDocument = $('#typeDocumentSelectSeller').val();
    var documentNumber = $('#TxtDocumSeller').val();
    var comment = $('#TxtCommentSeller').val();
    var branchId = $('#SelectBranchSeller').val();

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
    else if (dateB == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir el la fecha de naciemiento.'
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
    else if (branchId == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir el número de sucursal.'
        });
        return;
    }

    data.push({
        "id": 0,
        "firstName": fName,
        "lastName": sName,
        "comment": comment,
        "dateBirth": dateB,
        "documentNumber": documentNumber,
        "typeDocument": typeDocument,
        "branchId": branchId,
        "email": email1,
        "insertUser": "Admin",
        "dateInsertUser": new Date(),
        "updateUser": "Admin",
        "dateUpdateUser": new Date()
    });

    //obj.data = data;

    console.log(JSON.stringify(data[0]));

    let url = ApiBackEndUrl + 'Sellers/insertSellers';

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

                if (result.status == 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo acceder a la API!',
                        text: 'No se guardó correctamente el registro'
                    });

                    return;
                }


                Swal.fire({
                    icon: 'info',
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guardó correctamente el registro'
                });

                fnCleanSeller();
                fnLoadSellers(0, 10);
            });
}

function fnSelectSeller(nameControl: string) {
    let url = ApiBackEndUrl + 'Sellers/GetSellers';

    nameControl = '#' + nameControl;
    var selSellers = $(nameControl);

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: '0',
                take: '1000'
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                selSellers.empty();
                var cont = 0;

                for (var j in result) {
                    //selSellers.append(result[cont].sellerId)

                    var option = $(document.createElement("option"));
                    option.val(result[cont].sellerId);
                    option.text(result[cont].firstName);

                    selSellers.append(option);
                    cont++;
                }

            });
}

//#endregion Sección de Vendedores

/*
 ##########################################################
 ######################### Ventas #########################
 ##########################################################
 */

//#region Sección de Ventas

function fnAddSales() {
    fnCleanSale();
    $('#ModalSales').modal('show');
}

function fnBtnSaveSale() {
    let data = [];
    var obj = {};

    var CarNumber = $('#TxtNumberSale').val();
    var DateSale = $('#DpickerDateSale').val();
    var SaleClient = $('#SelectSaleClient').val();
    var SaleSeller = $('#SelectSaleSeller').val();
    var SaleChannel = $('#SelectSaleChannel').val();
    var SaleBranch = $('#SelectSaleBranch').val();
    var SaleCoin = $('#SelectSaleCoin').val();
    var CommentSale = $('#TxtCommentSale').val();

    if (DateSale == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacia la fecha.'
        });
        return;
    } else if (CarNumber == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el número de carrito.'
        });
        return;
    } else if (SaleClient == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el cliente.'
        });
        return;
    } else if (SaleSeller == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el vendedor.'
        });
        return;
    } else if (SaleChannel == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el canal.'
        });
        return;
    } else if (SaleBranch == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio la sucursal.'
        });
        return;
    } else if (SaleCoin == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio la moneda.'
        });
        return;
    }

    data.push({
        "id": 0,
        "shoppingCarNumber": CarNumber,
        "clientsId": SaleClient,
        "date": DateSale,
        "sellersId": SaleSeller,
        "reserve": "",
        "gbSale": "0",
        "gmSale": "0",
        "comment": CommentSale,
        "channelsId": SaleChannel,
        "branchesId": SaleBranch,
        "payment": "",
        "coinsId": SaleCoin,
        "insertUser": "Admin",
        "dateInsertUser": new Date(),
        "updateUser": "Admin",
        "dateUpdateUser": new Date()
    });


    //obj.data = data;
    //console.log(JSON.stringify(data[0]));

    let url = ApiBackEndUrl + 'CreditDocuments/insertCreditDocuments';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: JSON.parse(dataWeb).token
            },
            body: JSON.stringify(data[0])

        })
        .then(
            response => response.json())
        .then(
            result => {
                Swal.fire({
                    icon: 'info',
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guardó correctamente el registro'
                });

                fnCleanSale();
                fnLoadSales(1, 5);
            });
}

function fnLoadSales(page: number, pageSize: number) {
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetCreditDocumentsClients';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                page:     page.toString(),
                pageSize: pageSize.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabSalesT > tbody").empty();
                var cont = 0;

                //console.log('fnSalesDetail(' + result[cont].DocNum + ',"' + result[cont].CarNumber + '")');

                for (var j in result) {

                    var newRow = document.createElement("tr");

                    var newCell = document.createElement("td");
                    newCell.innerHTML = moment(result[cont].DateCredit).format("DD-MM-YYYY");
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].ClientsFullName;
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].ClientDocument;
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].SellerFullName;
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].CarNumber;
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var btn = document.createElement("btnDetailSale");
                    btn.innerHTML = '<i class="fa-solid fa-cart-flatbed-suitcase"></i>';
                    btn.classList.add("btnGrid");
                    btn.setAttribute('onclick', 'fnSalesDetail(' + result[cont].DocNum + ',"' + result[cont].CarNumber +  '")')
                    var newCell = document.createElement("td");
                    newCell.appendChild(btn);
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    cont++;

                }

                //console.log(result);

                $('#spinnerSales').hide();
            })
        .catch(error => {
            Swal.fire(
                'Se detecto un error!',
                'Error en la solicitud al sitio remoto (API).',
                'error: ' + error
            )
        });
}

function fnCleanSale() {
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateSale").val(TodayString);
    $('#TxtAmountSale').val('0,00');
    $('#SelectSaleClient').empty();
    $('#SelectSaleSeller').empty();
    fnLoadSelect('SelectSaleSeller', 'Account/GetUserSeller');
    $('#SelectSaleChannel').empty();
    $('#SelectSaleBranch').empty();
    fnLoadSelect('SelectSaleBranch', 'Branches/GetBranches');
    $('#SelectSaleCoin').empty();
    fnLoadSelect('SelectSaleCoin', 'Coins/GetCoins')
    $('#TxtCommentSale').val('');
    $('#TxtNumberSale').val('');
}

//#endregion Sección de Ventas


//#region Sección de detalle de Ventas

//async function fnChangeSelect() {
//    if ($('#SelectSaleDeailProduct').val() == null)
//        return;

//    var productType: string = $('#SelectSaleDeailProduct').val(); 

//    $('#spinnerSalesModal').show();
//    await $('#SelectSaleDeailFrom').empty();
//    await $('#SelectSaleDeailTo').empty();

//    if (productType == '2') {        
//        $('#divCountry').removeAttr("style").hide();

//        await fnLoadSelect('SelectSaleDeailFrom', 'Destinations/GetDestinationsCountries');
//        await fnLoadSelect('SelectSaleDeailTo', 'Destinations/GetDestinationsCountries');
        
//    }
//    else {        
//        $('#divCountry').show();
//        if ($('#SelectSaleCountry').length > 1)
//            return;

//        await $('#SelectSaleCountry').empty();
//        await fnLoadSelect('SelectSaleCountry', 'Destinations/GetDestinationsCountries');

//        if ($('#SelectSaleCountry').val() != null) {
//            await fnLoadProvices('SelectSaleCountry');
//        }
//    }

//    $('#spinnerSalesModal').removeAttr("style").hide();
//}

//function fnLoadProvices(nameControl: string) {

//    //var country: string = $('#SelectSaleCountry').val();
//    var dataWeb: any = sessionStorage.getItem("TecnoData");
//    var url: string = ApiBackEndUrl + 'Destinations/GetDestinationsProvinces';
//    nameControl = '#' + nameControl;
//    var selectControl = $(nameControl);
//    var countrySelect = selectControl.find('option:selected').text();

    

//    let response = fetch(url,
//        {
//            method: 'GET',
//            headers: {
//                Country: countrySelect,
//                skip: "0",
//                take: "1000",
//                Authorization: JSON.parse(dataWeb).token
//            }
//        })
//        .then(
//            response => response.json())
//        .then(
//            async result => {
                
//                var cont = 0;

//                if (nameControl == '#SelectSaleCountry') {
//                    await $('#SelectSaleDeailFrom').empty();
//                    await $('#SelectSaleDeailTo').empty();

//                    for (var j in result) {
//                        var option = $(document.createElement("option"));
//                        option.val(result[cont].id);
//                        option.text(result[cont].provinceName);

//                        await $('#SelectSaleDeailFrom').append(option);
//                        //await $('#SelectSaleDeailTo').append(option);

//                        cont++;
//                    }

//                    cont = 0;

//                    for (var j in result) {
//                        var option = $(document.createElement("option"));
//                        option.val(result[cont].id);
//                        option.text(result[cont].provinceName);

//                        //await $('#SelectSaleDeailFrom').append(option);
//                        await $('#SelectSaleDeailTo').append(option);

//                        cont++;
//                    }
//                }

                
                
//            })
//        .catch(error => {
//            Swal.fire({
//                icon: 'error',
//                title: 'Error de consulta',
//                text: 'Hubo un error: ' + error
//            });

            
//        });
        
//}

function fnSalesDetail(DocNum: number, CarNumber: string) {
    $('#lblCarNumber').html(DocNum.toString());
    $('#TxtIdSaleDetail').val(DocNum.toString());
    //fnChangeSelect();
    fnLoadSalesDetail(DocNum, CarNumber);
}

function fnLoadSalesDetail(CreditDocumentId: number, CarNumber: string) {
    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsDetail';
    $('#spinnerSalesDetail').show();
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                CreditDocumentId: CreditDocumentId.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                console.log(result);

                $("#TabSalesDetailT > tbody").empty();
                var cont:number = 0;
                var total: number = 0;

                for (var j in result) {

                    var amount: number = result[cont].Amount;
                    var utility: number = result[cont].Utility;
                    var mkup: number = result[cont].Mkup;

                    var newRow = document.createElement("tr");

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].ItemsCreditDocumentsId;
                    newCell.style.display = 'none';
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);
                    

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Product;
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Description;
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = amount.toLocaleString('de-DE', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = utility.toLocaleString('de-DE', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = mkup.toLocaleString('de-DE', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnDetailSaleDelete");
                    btn1.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnSalesDetailDelete(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')')

                    var btn2 = document.createElement("btnDetailSaleUpdate");
                    btn2.innerHTML = '<i class="fa-solid fa-pencil"></i>';
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnSalesDetailUpdate(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')')

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);
                    //##################################

                    cont++;
                    total += amount;
                }

                $('#lblCarNumber').empty();
                $('#lblCarNumber').html(CarNumber + " - renglones: " + cont + " - total: " + total.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                $('#spinnerSalesDetail').hide();

                //console.log(result);
            })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error de consulta',
                text: 'Hubo un error al cargar el detalle del carrito seleccionado'
            });
        });
}

function fnSalesDetailDelete(carNum: number, carItem: number) {

    var CarNumber: string = $('#lblCarNumber').html();
    CarNumber = CarNumber?.toString().substring(0, CarNumber?.toString().indexOf('- renglones'));

    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro del carrito ' + CarNumber + ' definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result:any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'ItemsCreditDocuments/deleteItemsCreditDocuments';
            var dataWeb: any = sessionStorage.getItem("TecnoData");

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: carItem.toString(),
                        Authorization: JSON.parse(dataWeb).token
                    }
                })
                .then(response => response.json())
                .then(
                    result => {

                        if (result == true) {

                            //fnLoadSalesDetail(carNum);

                            Swal.fire(
                                'Borrado!',
                                'Registro borrado satisfactoriamente.',
                                'success'
                            );

                            fnLoadSalesDetail(carNum, CarNumber);
                        }
                        else {
                            Swal.fire(
                                'Se detecto un error!',
                                'el archivo no pudo ser borrado.',
                                'error'
                            )
                        }

                        
                    })
                .catch(error => {
                    Swal.fire(
                        'Se detecto un error!',
                        'Error en la solicitud al sitio remoto (API).',
                        'error'
                    )
                });

            
        }
    });
}

async function fnSalesDetailUpdate(carNum: number, carItem: number) {
    fnAddSalesDetail();
    $('#lblSalesDetailId').html(carItem.toString());    
    await fnLoadSelect('SelectSaleDeailProduct', 'Products/GetProducts');
    //await fnLoadSelect('SelectSaleDeailFrom', 'Destinations/GetDestinationsCountries');
    await fnLoadSelect('SelectSaleDeailTo', 'Destinations/GetDestinationsCountries');

    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsById';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                id: carItem.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            async result => {

                await $('#SelectSaleDeailProduct').val(result.productsId);
                await $('#DpickerDateSaleDetail').val(moment(result.travelDate).format('YYYY-MM-DD'));
                //await $('#SelectSaleDeailFrom').val(result.destinationsFrom);
                await $('#SelectSaleDeailTo').val(result.destinationsTo);
                await $('#TxtAmountSaleDetail').val(result.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                await $('#TxtUtilitySaleDetail').val(result.utility.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                await $('#TxtMkupSaleDetail').val(result.mkup.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
            });
}

function fnAddSalesDetail() {

    if ($('#TxtIdSaleDetail').val() == "") {
        Swal.fire({
            icon: 'warning',
            title: 'No tiene carrito seleccionado',
            text: 'Seleccione un carrito para agregar un detalle'
        });

        return;
    }

    fnCleanSaleDetail();
    $('#ModalSalesDetail').modal('show');
}

function fnCleanSaleDetail() {

    var today: Date = new Date();

    $("#SelectSaleDeailProduct").empty();
    //$("#SelectSaleCountry").empty();
    //$("#SelectSaleDeailFrom").empty();
    $('#DpickerDateSaleDetail').val(moment(today).format('YYYY-MM-DD'))
    $("#SelectSaleDeailTo").empty();
    $('#TxtAmountSaleDetail').val('0,00');
    $('#TxtUtilitySaleDetail').val('0,00');
    $('#TxtMkupSaleDetail').val('0,00');
    $('#lblSalesDetailId').html('');
}

function fnBtnSaveSaleDetail() {
    let data = [];
    var obj = {};
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    
    var SaleId_ = $('#TxtIdSaleDetail').val();
    var TravelDate = $('#DpickerDateSaleDetail').val();
    var SaleDetailId_ = $('#lblSalesDetailId').html();
    var Product_ = $('#SelectSaleDeailProduct').val();
    //var From_ = $('#SelectSaleDeailFrom').val();
    var To_ = $('#SelectSaleDeailTo').val();
    var Amount_ = $('#TxtAmountSaleDetail').val();
    var Utility_ = $('#TxtUtilitySaleDetail').val();
    var Mkup_ = $('#TxtMkupSaleDetail').val();

    var isUpdate: boolean = (SaleDetailId_ == "" ? false : true)

    if (Product_ == "" || Product_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el producto'
        });
        return;
    }
    //else if (From_ == "" || From_ == null) {
    //    Swal.fire({
    //        icon: 'warning',
    //        title: 'Complete todos los campos',
    //        text: 'No puede estar vacio el origen'
    //    });
    //    return;}
    else if (To_ == "" || To_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el destino'
        });
        return;
    } else if (Amount_ == "" || Amount_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el monto'
        });
        return;
    } else if (Utility_ == "" || Utility_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio la utilidad'
        });
        return;
    } else if (Mkup_ == "" || Mkup_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el campo Mkup'
        });
        return;
    } 

    if (!isUpdate) {

        data.push({
            "id": 0,
            "creditDocumentsId": SaleId_,
            "travelDate": TravelDate,
            "productsId": Product_,
            "destinationsTo": To_,
            "destinationsFrom": To_, //From_,
            "amount": Amount_,
            "utility": Utility_,
            "mkup": Mkup_,
            "InsertUser": (JSON.parse(dataWeb).userId).toString(),
            "DateInsertUser": new Date()
        });

        //console.log(JSON.stringify(data[0]))

        let url = ApiBackEndUrl + 'ItemsCreditDocuments/insertItemsCreditDocuments';

        let response = fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: JSON.parse(dataWeb).token
                },
                body: JSON.stringify(data[0])

            })
            .then(
                response => response.json())
            .then(
                result => {

                    if (result) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Registro agregado exitosamente!',
                            text: 'Se guardó correctamente el registro'
                        });

                        var CarNumber: string = $('#lblCarNumber').html();
                        CarNumber = CarNumber?.toString().substring(0, CarNumber?.toString().indexOf('- renglones'));

                        fnLoadSalesDetail(SaleId_, CarNumber);

                        fnCleanSaleDetail();
                        //fnLoadSalesDetail(Number(SaleId_));
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'No se pudo guardar el registro!',
                            text: 'Hubo un error, devolvió: ' + result
                        });
                    }
                    
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo guardar el registro!',
                    text: 'Hubo un error: ' + error
                });
            });
    }
    else {

        data.push({
            "id": SaleDetailId_,
            "creditDocumentsId": SaleId_,
            "travelDate": TravelDate,
            "productsId": Product_,
            "destinationsTo": To_,
            "destinationsFrom": To_, //From_,
            "amount": Amount_,
            "utility": Utility_,
            "mkup": Mkup_,
            "InsertUser": "",
            "DateInsertUser": new Date(),
            "UpdateUser": (JSON.parse(dataWeb).userId).toString(),
            "DateUpdateUser": new Date()
        });

        let url = ApiBackEndUrl + 'ItemsCreditDocuments/updateItemsCreditDocuments';

        let response = fetch(url,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    mode: 'no-cors'
                },
                body: JSON.stringify(data[0])

            })
            .then(
                response => response.json())
            .then(
                result => {
                    Swal.fire({
                        icon: 'info',
                        title: 'Registro actualizado exitosamente!',
                        text: 'Se guardó correctamente el cambio.'
                    });

                    fnCleanSaleDetail();
                    //fnLoadSalesDetail(Number(SaleId_));
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo guardar el registro!',
                    text: 'Hubo un error: ' + error
                });
            });
    }

    
}

//#endregion Sección de detalle de Ventas