import { strict } from "assert";
import { Console, error } from "console";
//import "jquery";
//import * as bootstrap from "bootstrap";
//import require from "node:stream/consumers";

declare let Swal: any;
declare let moment: any;
declare let require: any;
declare let $: any;
declare let Highcharts: any;

const iconDelete: string = '<i class="fa-solid fa-delete-left"></i>';
const iconUpdate: string = '<i class="fa-solid fa-pencil"></i>';

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

//############ Server mlapp ############
var ApiBackEndUrl: string = "https://mlapp.tecnovoz.com.ar:8092/api/";
var FrontEnd = "https://mlapp.tecnovoz.com.ar:8090/";

//############ Server t7 ############
//var ApiBackEndUrl: string = "https://t7.tecnovoz.com.ar:8091/api/";
//var FrontEnd: string = "https://t7.tecnovoz.com.ar:8090/";

//############ Desarrollo ############
//var ApiBackEndUrl: string = "https://mlapp.tecnovoz.com.ar:8092/api/";
//var FrontEnd: string = "https://localhost:7119/";

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

async function showDiv(divSelPrincipal:string) {
    hideAll();
    $('#' + divSelPrincipal).show();

    if (divSelPrincipal == "MasterClients")
        fnLoadClients();
    if (divSelPrincipal == "MasterSellers")
        fnLoadSellers(1, 5);
    if (divSelPrincipal == "MasterSales")
        fnLoadSales();
    if (divSelPrincipal == "MasterProducts")
        fnLoadProducts();
    if (divSelPrincipal == "MasterBranches")
        fnLoadBranches();
    if (divSelPrincipal == "MasterCoins")
        fnLoadCoins();
    if (divSelPrincipal == "MasterDestinations")
        fnLoadDestinations();
    if (divSelPrincipal == "MasterGoals")
        fnLoadGoals();
    if (divSelPrincipal == "MasterHolidays")
        fnLoadHolidays();

    showMenu();

    fnSalesGraph();
        
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
        $("#menu-principal-1").hide();
        $("#menu-principal-2").hide();
        $("#menu-principal-3").hide();
    } else {
        $("#first-menu").show(100);
    }
}

function hideAll() {
    $('.divMaster').hide();
}

function fnShowGeneralSearch(LabelSearch: string) {
    fnCleanGeneralSearch();

    $('#lblModalTypeSearch').html(LabelSearch);
    var lblSearch = $('#lblModalTypeSearch').html();
    $('#spinnerGeneralSearch').show();    
    $('#ModalSearch').modal('show');

    if (lblSearch == 'clientes') {
        var SearchValue = $('#TxtSaleClient').val();
        $('#txtSearch').val(SearchValue);
        fnLoadGeneralSearch();
    }
}

function fnCleanGeneralSearch() {
    $('#lblModalTypeSearch').html('');
    $('#txtSearch').val('');
    $('#SalesGeneralSearchNPosition').val('1');
    $('#selGeneralSearchGroup').html('5');
}

function fnChangeGeneralSearch(num: number) {
    $('#selGeneralSearchGroup').html(num);    
    fnSearchClient();
}

function fnLoadGeneralSearch() {
    var lblSearch = $('#lblModalTypeSearch').html();

    if (lblSearch == 'clientes') {
        fnSearchClient();
    }
}

$('#txtSearch').keypress(function (e: any) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        $('#spinnerGeneralSearch').show();
        var TxtSearch = $('#txtSearch').val();
        fnSearchClient();
    }
});

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
    //Función que inicia los indicadores de entrada
    //await fnReportGoals();
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
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnProductDelete(' + result[cont].id + ')')

                    var btn2 = document.createElement("btnProductUpdate");
                    btn2.innerHTML = iconUpdate;
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

function fnAddClient(origin: string) {
    fnCleanClient();
    $('#lblOrigin').html(origin);
    $('#ModalClients').modal('show');
}

function fnLoadClients() {

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

                    //Creo los dos botones para la tabla
                    //var btn1 = document.createElement("btnClientDelete");
                    //btn1.innerHTML = iconDelete;
                    //btn1.classList.add("btnGridDelete");
                    //btn1.setAttribute('onclick', 'fnProductDelete(' + result[cont].id + ')');                    

                    var btn1 = $('<button/>', {
                        id: 'btnClientDelete',
                        html: 'Prueba 123', //iconDelete,
                        title: 'Texto de ayuda aquí',
                        class: 'btnGridUpdate'
                    });

                    var btn2 = document.createElement("btnProductUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnProductUpdate(' + result[cont].id + ')');

                    var btn3 = document.createElement("btnSalesClients");
                    btn3.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i>';
                    btn3.classList.add("btnGridSalesClients");
                    btn3.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newCell.appendChild(btn3);
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    //##################################

                    cont++;

                }

                //console.log(result);
                $('#spinnerClients').hide();

                //$("#TabClientsT").tablesorter({
                //    headers: {
                //        0: { sorter: false } // deshabilita el ordenamiento de la primera columna (números)
                //    }
                //});
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
    var skip = position[0];
    var take = position[1];
    
    //Para saber donde estamos 
    var locationView = "";
    if ($("#ModalSales").is(":visible") && $('#lblModalTypeSearch').html() == 'clientes')
        locationView = "General";
    else if ($("#MasterClients").is(":visible"))
        locationView = "Clients";

    if (locationView == "General") { //Si estamos en la busqueda del carrito de ventas
        var txtSearch = $("#txtSearch").val();

        if (txtSearch != "")
            select +=  "where FirstName + ' ' + LastName like('%" + txtSearch + "%') or DocumentNumber like('%" + txtSearch + "%')";
    }
    else if (locationView == "Clients"){ //Si estamos en la vista de Clientes
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
    }

    
    console.log(select);

        let url = ApiBackEndUrl + 'Clients/DynamicGetClientsSelect';
        var dataWeb: any = sessionStorage.getItem("TecnoData");
        

        let response = fetch(url,
            {
                method: 'GET',
                headers: {
                    select: select.toString(),
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
                    $("#TableSearchT > tbody").empty();
                    var cont = 0;

                    for (var j in result) {

                        if (locationView == "Clients") {
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

                            //Creo los dos botones para la tabla
                            var btn1 = document.createElement("btnProductDelete");
                            btn1.innerHTML = iconDelete;
                            btn1.classList.add("btnGridDelete");
                            btn1.setAttribute('onclick', 'fnProductDelete(' + result[cont].id + ')');

                            var btn2 = document.createElement("btnProductUpdate");
                            btn2.innerHTML = iconUpdate;
                            btn2.classList.add("btnGridUpdate");
                            btn2.setAttribute('onclick', 'fnProductUpdate(' + result[cont].id + ')');

                            var btn3 = document.createElement("btnSalesClients");
                            btn3.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i>';
                            btn3.classList.add("btnGridSalesClients");
                            btn3.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')

                            var newCell = document.createElement("td");
                            newCell.appendChild(btn1);
                            newCell.appendChild(btn2);
                            newCell.appendChild(btn3);
                            newRow.append(newCell);
                            $("#rowsClient").append(newRow);
                            //##################################
                        }
                        else if (locationView == "General") {
                            var id_ = result[cont].id;
                            var name_ = result[cont].firstName;
                            var lname_ = result[cont].lastName;
                            var document_ = result[cont].documentNumber;

                            var newRow = document.createElement("tr");
                            var newCell = document.createElement("td");
                            newCell.innerHTML = id_;
                            newRow.append(newCell);
                            newCell.style.display = 'none';
                            $("#rowsSearch").append(newRow);

                            var newCell = document.createElement("td");
                            newCell.innerHTML = name_ + " " +lname_;
                            newRow.append(newCell);
                            $("#rowsSearch").append(newRow);

                            var newCell = document.createElement("td");
                            newCell.innerHTML = document_;
                            newRow.append(newCell);
                            $("#rowsSearch").append(newRow);

                            var btn1 = document.createElement("btnSalesClients");
                            btn1.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
                            btn1.classList.add("btnGridSalesClients");
                            btn1.setAttribute('onclick', 'fnSelectSearchClient(' + id_ + ',"' + name_ + ' ' +lname_ +'")')

                            var newCell = document.createElement("td");
                            newCell.appendChild(btn1);
                            newRow.append(newCell);
                            $("#rowsSearch").append(newRow);
                        } 
                        

                        cont++;
                    }

                    //console.log(result);
                    $('#spinnerClients').hide();
                    $('#spinnerGeneralSearch').hide();
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'No se acceder a la API!',
                    text: 'Hubo un error: ' + error
                });
            });    
}

function fnSelectSearchClient(id: number, name: string) {

    $('#TxtSaleClient').val(name);
    $('#lblSaleClient').html(id)
    //alert(id.toString() + " " + name);
    $('#ModalSearch').modal('hide');
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

                $('#ModalClients').modal('hide');

                if ($('#lblOrigin').html() == 'Ventas') {
                    $('#TxtSaleClient').val(fName + ' ' + sName);
                    $('#lblSaleClient').html(result.id);
                }
                else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Registro agregado exitosamente!',
                        text: 'Se guardó correctamente el registro'
                    });
                }
                
                //var position = fnPositionClient();

                fnCleanClient();
                fnLoadClients();
            });

}

function fnPositionClient() {
    let Position = 0;
    let Records = 0;

    if ($("#ModalSales").is(":visible") && $('#lblModalTypeSearch').html() == 'clientes') { //Si estamos en la busqueda del carrito de ventas
        Position = $('#SalesGeneralSearchNPosition').val();
        Records = $('#selGeneralSearchGroup').html();
    }
    else if ($("#MasterClients").is(":visible")) { //Si esta visible la sección de los clientes
        Position = $('#ClientsNPosition').val();
        Records = $('#selDataGroup').html();
    }
    
    return [Position, Records];
}

//function fnShowPositionClients() {

//} 

function fnChangeDataGroupClients(num: number) {
    $('#selDataGroup').html(num);
    fnCleanClient();
    fnLoadClients();
}

function fnClientsDelete(id: number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro con id: "' + id + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'Clients/DeleteClient';

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

                            fnLoadClients();

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

    //console.log(JSON.stringify(data[0]));

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
    var SaleClient = $('#lblSaleClient').html();
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
                fnLoadSales();
            });
}

function fnLoadSales() {
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetCreditDocumentsClients';
    var position = fnPositionSale();
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

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnSaleDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnSalesDelete(' + result[cont].DocNum + ')')

                    var btn2 = document.createElement("btnDetailSaleDetail");
                    btn2.innerHTML = '<i class="fa-solid fa-cart-flatbed-suitcase"></i>';
                    btn2.classList.add("btnGridSalesClients");
                    btn2.setAttribute('onclick', 'fnSalesDetail(' + result[cont].DocNum + ',"' + result[cont].CarNumber + '")');

                    var btn3 = document.createElement("btnSalePayment");
                    btn3.innerHTML = '<i class="fa-solid fa-circle-dollar-to-slot"></i>';
                    btn3.classList.add("btnGridUpdate");
                    btn3.setAttribute('onclick', 'fnSalesPayment(' + result[cont].DocNum + ',' + result[cont].Amount + ')')
                    
                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newCell.appendChild(btn3);
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);
                    //##################################

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

function fnSalesDelete(num: number) {

    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro ' + num + ' definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'CreditDocuments/DeleteCreditDocuments';
            var dataWeb: any = sessionStorage.getItem("TecnoData");

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: num.toString(),
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

                            fnLoadSales();
                        }
                        else {
                            Swal.fire(
                                'Se detecto un error!',
                                'el registro no pudo ser borrado, asegurese de que no tenga renglones asociados.',
                                'error'
                            )
                        }
                    })
                .catch(error => {
                    Swal.fire(
                        'Se detecto un error!',
                        'Error en la solicitud al sitio remoto (API). Error: ' + error,
                        'error'
                    )
                });
        }
    });        
}

function fnCleanSale() {
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateSale").val(TodayString);
    $('#TxtAmountSale').val('0.00');
    $('#TxtSaleClient').val('');
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

function fnPositionSale() {
    let Position = $('#SalesNPosition').val();
    let Records = $('#selDataSalesGroup').html();
    return [Position, Records];
}

function fnChangeDataGroupSales(num: number) {
    $('#selDataSalesGroup').html(num);
    fnCleanSale();
    fnLoadSales();
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

                //console.log(result);

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
                    newCell.innerHTML = amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = utility.toLocaleString('en-US', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = mkup.toLocaleString('en-US', { minimumFractionDigits: 2 });
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnDetailSaleDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnSalesDetailDelete(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')')

                    var btn2 = document.createElement("btnDetailSaleUpdate");
                    btn2.innerHTML = iconUpdate;
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
                $('#lblCarNumber').html(CarNumber + " - renglones: " + cont + " - total: " + total.toLocaleString('en-US', { minimumFractionDigits: 2 }));
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
                await $('#TxtAmountSaleDetail').val(result.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
                await $('#TxtUtilitySaleDetail').val(result.utility.toLocaleString('en-US', { minimumFractionDigits: 2 }));
                await $('#TxtMkupSaleDetail').val(result.mkup.toLocaleString('en-US', { minimumFractionDigits: 2 }));
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
    $('#TxtAmountSaleDetail').val('0.00');
    $('#TxtUtilitySaleDetail').val('0.00');
    $('#TxtMkupSaleDetail').val('0.00');
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

    var AmountN = +$('#TxtAmountSaleDetail').val();
    var UtilityN = +$('#TxtUtilitySaleDetail').val();
    var MkupN = +$('#TxtMkupSaleDetail').val();

    var Amount_ = AmountN.toString().replace(',', '');
    var Utility_ = UtilityN.toString().replace(',', '');
    var Mkup_ = MkupN.toString().replace(',', '');

    var isUpdate: boolean = (SaleDetailId_ == "" ? false : true)

    if (Product_ == "" || Product_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Atención: No puede estar vacio el producto'
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

        console.log(JSON.stringify(data[0]))

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
            "updateUser": (JSON.parse(dataWeb).userId).toString(),
            "dateUpdateUser": new Date()
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

//#region Seccion de Pagos

function fnSalesPayment(num: number, amount: number) {
    fnCleanPayment(); 
    $('#btnSavePayment').show();
    $('#btnCleanPayment').show();
    $('#TxtIdPayment').val(num);
    $('#lblTotalOpr').html(amount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    $('#lblTotalOpr2').html(amount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    fnLoadPayment(num);
    $('#ModalPayment').modal('show');    
}

function fnBtnSavePayment() {

    var total_ = $('#lblTotalOpr').html();

    if (total_ != '0.00') {
        Swal.fire({
            icon: 'warning',
            title: 'No se puede guardar un pago con saldo distinto a cero',
            text: 'Para guardar un pago este debe tener saldo 0 (cero)'
        });

        return;
    }

    var table_ = document.getElementById("TabPaymentT") as unknown as HTMLTableElement;

    for (var i = 0, row; row = table_.rows[i]; i++) {
        var typePay: string = "";
        var amount: number = 0;
        var envelope: string = "";

        for (var j = 0, col; col = row.cells[j]; j++) {
            if (i >= 1) {
                //console.log(`${col.innerText} \tFila: ${i} \t Celda: ${j}`);
                switch (j) {
                    case 0:
                        typePay = col.innerText;
                        break;
                    case 1:
                        amount = +col.innerText.replace('.','').replace(',','.');
                        break;
                    case 2:
                        envelope = col.innerText;
                        var creditDocumentId = $('#TxtIdPayment').val();
                        var datePay = $('#DpickerDatePayment').val();
                        console.log("Tipo: " + typePay + ", Monto: " + amount + ", Sobre: " + envelope);

                        let url = ApiBackEndUrl + 'Payments/insertPayments';
                        var dataWeb: any = sessionStorage.getItem("TecnoData");

                        let data:any = [];

                        data.push({
                            "id": 0,
                            "creditDocumentsId": creditDocumentId,
                            "datePay": datePay,
                            "typePay": typePay,
                            "envelope": envelope,
                            "amount": amount,                            
                            "insertUser": JSON.parse(dataWeb).userName,
                            "dateInsertUser": new Date(),
                            "updateUser": JSON.parse(dataWeb).userName,
                            "dateUpdateUser": new Date()
                        });

                        

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

                                    fnCleanPayment();
                                })
                            .catch(error => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'No se pudo insertar el registro',
                                    text: 'Error reportado: ' + error
                                });
                            });

                        break;
                    default:
                }

            }            
        }
    }
}

function fnCleanPayment() {    
    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    var total_: number = $('#lblTotalOpr2').html();

    $("#TabPaymentT > tbody").empty();
    $("#DpickerDatePayment").val(TodayString);
    $("#TxtCommentPayment").val('');
    $('#TxtAmountPayment').val('0.00');
    $('#typePayment').val('Efectivo pesos');    
    $('#lblTotalOpr').html(total_);
    $('#TxtPaymentEnvelope').val('0');
    $('#divEnvelope').show();
    $('#TxtCoinValue').val('1');
}

function fnAddPaymentRecord() {

    var nrows = 0;
    var files = $("#TabPaymentT tr").each(function () {
        nrows++;
    })

    var typePay = $('select[id="typePayment"] option:selected').text(); 
    var amount = $('#TxtAmountPayment').val();
    var coinValue = $('#TxtCoinValue').html();
    var totalS: number = $('#lblTotalOpr').html().replace('.','').replace(',','.');
    var id_ = nrows; //$('#TxtIdPayment').val();
    var amountN: number = +amount.replace('.', '').replace(',', '.');
    var coinValueN: number = +coinValue;
    var valueInPesos = amountN * coinValueN;
    var balance: number = +totalS;
    var totalBalance: number = balance - valueInPesos;
    var envelope: string = $('#TxtPaymentEnvelope').val();
    amount = amountN.toLocaleString('en-US', { minimumFractionDigits: 2 });

    if (amountN == 0) {
        Swal.fire({
            icon: 'error',
            title: 'El valor del monto no puede ser cero!',
            text: 'Introduzca un monto valido'
        });

        return;
    } else if (totalBalance < 0) {
        Swal.fire({
            icon: 'error',
            title: 'El monto ingresado supera el saldo pendiente',
            text: 'Introduzca un monto valido'
        });

        return;
    }
    
    var newRow = document.createElement("tr");
    newRow.setAttribute('id', 'f' + id_);

    var newCell = document.createElement("td");
    newCell.innerHTML = typePay;
    newRow.append(newCell);
    $("#rowsPayment").append(newRow);

    var newCell = document.createElement("td");
    newCell.innerHTML = amount;
    newRow.append(newCell);
    $("#rowsPayment").append(newRow);

    var newCell = document.createElement("td");
    newCell.innerHTML = envelope;
    newRow.append(newCell);
    $("#rowsPayment").append(newRow);

    var btn1 = document.createElement("btnPaymentRecordDelete");
    btn1.innerHTML = iconDelete;
    btn1.classList.add("btnGridDelete");
    btn1.setAttribute('onclick', 'fnPaymentRecordDelete("' + 'f' + id_ + '",' + amountN + ')')

    var newCell = document.createElement("td");
    newCell.appendChild(btn1);
    newRow.append(newCell);
    $("#rowsPayment").append(newRow);    

    $('#TxtAmountPayment').val('0.00'); 
    $('#lblTotalOpr').html(totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }));
}

function fnPaymentRecordDelete(num: string, amount: number) {
    var total = $('#lblTotalOpr').html().replace('.', '').replace(',', '.');
    var balance: number = +total;
    balance = balance + amount;
    var record = $('#' + num);
    record.remove();
    $('#lblTotalOpr').html(balance.toLocaleString('en-US', { minimumFractionDigits: 2 }));
}

async function fnTypePaymentSelect() {

    var TypeP = $('#typePayment').val();
    if (TypeP != '0') {
        $('#divEnvelope').show(); 

        let url = ApiBackEndUrl + 'Coins/GetValueCoin';
        var dataWeb: any = sessionStorage.getItem("TecnoData");

        let response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    CoinId: TypeP,
                    Authorization: JSON.parse(dataWeb).token
                }
            })
            .then(
                response => response.json())
            .then(
                result => {
                    $('#TxtCoinValue').html(result);    
                });
    }
    else {
        $('#divEnvelope').hide();
        $('#TxtCoinValue').html(1); 
    }

    $('#TxtPaymentEnvelope').val('0')

    $('#').val();
}

function fnLoadPayment(creditDocumentsId: number) {
    let url = ApiBackEndUrl + 'Payments/GetPaymentsForSale';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                creditDocumentsId: creditDocumentsId.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabPaymentT > tbody").empty();

                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].id;
                    var type_ = result[cont].typePay;
                    var amount_ = result[cont].amount;
                    var envelope_ = result[cont].envelope;


                    var newRow = document.createElement("tr");

                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsPayment").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = type_;
                    newRow.append(newCell);
                    $("#rowsPayment").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = amount_;
                    newRow.append(newCell);
                    $("#rowsPayment").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = envelope_;
                    newRow.append(newCell);
                    $("#rowsPayment").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = '-';
                    newRow.append(newCell);
                    $("#rowsPayment").append(newRow);

                    cont++;
                }

                if (cont > 0) {
                    $('#lblTotalOpr').html('0.00')
                    $('#btnSavePayment').hide();
                    $('#btnCleanPayment').hide();
                }
                    
                
            });
}

function fnDeletePayment() {

    var creditDocumentsId = $('#TxtIdPayment').val()

    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro de la venta con id: "' + creditDocumentsId + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'Payments/DeletePayments';
            var dataWeb: any = sessionStorage.getItem("TecnoData");

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        creditDocumentsId: creditDocumentsId,
                        Authorization: JSON.parse(dataWeb).token
                    }
                })
                .then(response => response.json())
                .then(
                    result => {

                        if (result == true) {

                            fnLoadPayment(creditDocumentsId);

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
                        'Error en la solicitud al sitio remoto (API). Error: ' + error,
                        'error'
                    )
                });

            fnLoadPayment(creditDocumentsId);
        }
    });
}


//#endregion Seccion de Pagos

/*
 ##########################################################
 ####################### Sucursales #######################
 ##########################################################
 */

//#region Sección de Sucursales

function fnLoadBranches() {
    let url = ApiBackEndUrl + 'Branches/GetBranches';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionBranches();
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

                $("#TabBranchesT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].id;
                    var description_ = result[cont].description;
                    var email_ = result[cont].email;
                    var isInShopping = result[cont].isInShopping;

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsBranches").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = description_;
                    newRow.append(newCell);
                    $("#rowsBranches").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = email_;
                    newRow.append(newCell);
                    $("#rowsBranches").append(newRow);

                    var newCell = document.createElement("td");
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = isInShopping;
                    checkbox.disabled = true;
                    newCell.appendChild(checkbox); newRow.append(newCell);
                    $("#rowsBranches").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnBranchesDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnBranchesDelete(' + id_ + ')')

                    var btn2 = document.createElement("btnBranchesUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnBranchesUpdate(' + id_ + ')')

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsBranches").append(newRow);
                    //##################################

                    cont++;
                }

                //console.log(result);
                $('#spinnerBranches').hide();
            });
}

function fnPositionBranches() {
    let Position = $('#BranchesNPosition').val();
    let Records = $('#selDataBranchesGroup').html();
    return [Position, Records];
}

function fnChangeDataGroupBranches(num: number) {
    $('#selDataBranchesGroup').html(num);
    fnCleanBranches();
    fnLoadBranches();
}

function fnAddBranches() {
    fnCleanBranches();
    $('#ModalBranches').modal('show');
}

function fnCleanBranches() {
    $('#TxtIdBranch').val('0');
    $('#txtNameBranches').val('');
    $('#txtEmailBranches').val('');
    $("#chkIsShopBranches").prop("checked", false);
}

function fnBranchesDelete(num: number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro con id: "' + num + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'Branches/DeleteBranch';
            var dataWeb: any = sessionStorage.getItem("TecnoData");

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: num.toString(),
                        Authorization: JSON.parse(dataWeb).token
                    }
                })
                .then(response => response.json())
                .then(
                    result => {

                        if (result == true) {

                            fnLoadBranches();

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
                        'Error en la solicitud al sitio remoto (API), error: ' + error,
                        'error'
                    )
                });


        }
    });
}

function fnBtnSaveBranches() {
    let data = [];
    var obj = {};

    var id_ = $('#TxtIdBranch').val();
    var description_ = $('#txtNameBranches').val();
    var email_ = $('#txtEmailBranches').val();
    var isInShopping_ = $("#chkIsShopBranches").is(":checked");
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    
    var isUpdate: boolean = (id_ == "0" || "" ? false : true)

    if (description_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el nombre!'
        });
        return;
    } else if (email_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el correo electrónico'
        });
        return;
    }

    if (!isUpdate) {
        let url = ApiBackEndUrl + 'Branches/insertBranches';

        data.push({
            "id": id_,
            "description": description_,
            "email": email_,
            "zoneId": "0",
            "typeId": "0",
            "isInShopping": isInShopping_,
            "insertUser": (JSON.parse(dataWeb).userId).toString(),
            "dateInsertUser": new Date(),
            "updateUser": "",
            "dateUpdateUser": new Date()
        });

        console.log("Insert: " + JSON.stringify(data[0]));

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

                    fnCleanBranches();
                    fnLoadBranches();
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la API',
                    text: 'No se pudo guardar el registro, error: ' + error
                });
            });

    }
    else {
        let url = ApiBackEndUrl + 'Branches/updateBranch';

        data.push({
            "id": id_,
            "description": description_,
            "email": email_,
            "zoneId": "0",
            "typeId": "0",
            "isInShopping": isInShopping_,
            "insertUser": (JSON.parse(dataWeb).userId).toString(),
            "dateInsertUser": new Date(),
            "updateUser": "",
            "dateUpdateUser": new Date()
        });

        console.log("Update: " + JSON.stringify(data[0]));

        let response = fetch(url,
            {
                method: 'PUT',
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
                        title: 'Registro actualizado exitosamente!',
                        text: 'Se actualizó correctamente el registro'
                    });

                    fnCleanBranches();
                    fnLoadBranches();
                })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la API',
                    text: 'No se pudo actualizar el registro, error: ' + error
                });
            });
    }

    

    
}

function fnBranchesUpdate(num: number) {
    fnAddBranches();
    let url = ApiBackEndUrl + 'Branches/GetBranchesById';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                id: num.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            async result => {
                await $('#TxtIdBranch').val(result.id);
                await $('#txtNameBranches').val(result.description);
                await $('#txtEmailBranches').val(result.email);
                await $('#chkIsShopBranches').prop("checked", result.isInShopping);
            })
}


//#endregion de Sucursales

/*
 ##########################################################
 ######################### Monedas ########################
 ##########################################################
 */

//#region Sección de Monedas

function fnLoadCoins() {
    let url = ApiBackEndUrl + 'Coins/GetCoinsDetail';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionCoins();
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

                $("#TabCoinsT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].coinId;
                    var description_ = result[cont].coinName;
                    var value_ = result[cont].value;
                    var dateUpdate_ = moment(result[cont].date).format("DD-MM-YYYY");

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsCoins").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = description_;
                    newRow.append(newCell);
                    $("#rowsCoins").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = value_;
                    newRow.append(newCell);
                    $("#rowsCoins").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = dateUpdate_;
                    newRow.append(newCell);
                    $("#rowsCoins").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnCoinsDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnCoinsDelete(' + id_ + ')')

                    var btn2 = document.createElement("btnCoinsUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnCoinsUpdate(' + id_ + ',"' + description_ + '")')

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsCoins").append(newRow);
                    //##################################

                    cont++;
                }

                //console.log(result);
                $('#spinnerCoins').hide();
            });
}

function fnPositionCoins() {
    let Position = $('#CoinsNPosition').val();
    let Records = $('#selDataCoinsGroup').html();
    return [Position, Records];    
}

function fnChangeDataGroupCoins(num: number) {
    $('#selDataCoinsGroup').html(num);
    fnCleanCoins();
    fnLoadCoins();
}

function fnCoinsDelete(id: number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro con id: "' + id + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'Coins/DeleteCoin';

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

                            fnLoadCoins();

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

function fnCleanCoins() {

}

function fnCoinsUpdate(CoinId: number, CoinName: string) { //Actualiza el valor de la moneda en el tiempo
    fnCleanHistoryCoins();
    $('#lblSelectCoin').html(CoinName);
    $('#TxtIdCoinHistory').val(CoinId);
    $('#ModalCoinHistory').modal('show');
    fnLoadHistoryCoins()
}

async function fnGetValueCoin(CoinId: number) {
    let url = ApiBackEndUrl + 'Coins/GetValueCoin';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
   
    let response = await fetch(url,
        {
            method: 'GET',
            headers: {
                CoinId: CoinId.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                console.log(result);
                return result;
            });
}

//#endregion de Monedas

//#region Sección de Historico de monedas

function fnCleanHistoryCoins() {
    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateCoinHistory").val(TodayString);
    $('#TxtAmountCoinHistory').val('0.00');    
}

function fnLoadHistoryCoins() {

    let url = ApiBackEndUrl + 'CoinHistory/GetCoinHistory';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionHistoryCoins();

    var coinId = $('#TxtIdCoinHistory').val();
    var skip = position[0];
    var take = position[1];

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                coinId: coinId,
                page: skip.toString(),
                pageSize: take.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabCoinHistoryT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].id;
                    var value_ = result[cont].valueCoin.toLocaleString('en-US', { minimumFractionDigits: 2 });
                    var date_ = moment(result[cont].date).format("DD-MM-YYYY");

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsCoinHistory").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = value_;
                    newRow.append(newCell);
                    $("#rowsCoinHistory").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = date_;
                    newRow.append(newCell);
                    $("#rowsCoinHistory").append(newRow);
                                        
                    //Creo los botones para la tabla
                    var btn1 = document.createElement("btnProductDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnCoinHistoryDelete(' + id_ + ')');

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newRow.append(newCell);
                    $("#rowsCoinHistory").append(newRow);
                    //##################################

                    cont++;
                }

            });
}

function fnCoinHistoryDelete(num: number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro ' + num + ' definitivamente?',
        text: '*ADVERTENCIA* tenga en cuenta que el borrar este tipo de registros puede ocasionar incosnsistencia en los datos, borrelo unicamente si lo acaba de incluir y no cuenta con transacciones.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {
            let url = ApiBackEndUrl + 'CoinHistory/DeleteCoinHistory';
            var dataWeb: any = sessionStorage.getItem("TecnoData");

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: num.toString(),
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

                            fnLoadHistoryCoins();
                        }
                        else {
                            Swal.fire(
                                'Se detecto un error!',
                                'el registro no pudo ser borrado, asegurese de que no tenga renglones asociados.',
                                'error'
                            )
                        }
                    })
                .catch(error => {
                    Swal.fire(
                        'Se detecto un error!',
                        'Error en la solicitud al sitio remoto (API). Error: ' + error,
                        'error'
                    )
                });
        }
    });
}

function fnPositionHistoryCoins() {
    let Position = 0;
    let Records = 0;

    Position = $('#CoinHistoryNPosition').val();
    Records = $('#selDataCoinHistoryGroup').html();

    return [Position, Records];
}

function fnBtnSaveCoinHistory() {
    var coinId = $('#TxtIdCoinHistory').val();
    var date = $('#DpickerDateCoinHistory').val();
    let data = [];
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    var amountString = $('#TxtAmountCoinHistory').val().replace('.', '').replace(',', '.');
    var amount: number = +amountString;

    if (amount == 0) {
        Swal.fire({
            icon: 'warning',
            title: 'El monto ingresado no puede ser cero',
            text: 'Rectifique el monto ingresado'
        });
        return;
    }

    data.push({
        "Id": 0,
        "coinsId": coinId,
        "valueCoin": amount,
        "date": date,
        "insertUser": (JSON.parse(dataWeb).userId).toString(),
        "dateInsertUser": new Date()
    });

    console.log(JSON.parse(dataWeb).token);

    let url = ApiBackEndUrl + 'CoinHistory/insertCoinHistory';

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

                fnLoadHistoryCoins();
            })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar el registro',
                text: 'Hubo un error al intentar guardar el registro, error: ' + error
            });
        });

}

function fnChangeDataGroupCoinHistory(num: number) {
    $('#selDataCoinHistoryGroup').html(num);
    var coinId = $('#TxtIdCoinHistory').val();
    fnLoadHistoryCoins()
}


//#endregion Sección de Historico de monedas

/*
 ##########################################################
 ######################## Destinos ########################
 ##########################################################
 */

//#region Sección de Destinos

function fnLoadDestinations() {
    let url = ApiBackEndUrl + 'Destinations/GetDestinationsCountries';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionDestinations();
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

                $("#TabDestinationsT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].id;
                    var description_ = result[cont].description;
                    var province_ = result[cont].province; 
                    var nameProvince_ = result[cont].provinceName;

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsDestinations").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = description_;
                    newRow.append(newCell);
                    $("#rowsDestinations").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = province_;
                    newRow.append(newCell);
                    $("#rowsDestinations").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = nameProvince_;
                    newRow.append(newCell);
                    $("#rowsDestinations").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnDestinationsDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnDestinationsDelete(' + id_ + ')')

                    var btn2 = document.createElement("btnDestinationsUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnDestinationsUpdate(' + id_ + ')')

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsDestinations").append(newRow);
                    //##################################

                    cont++;
                }

                //console.log(result);
                $('#spinnerDestinations').hide();
            });
}

function fnPositionDestinations() {
    let Position = $('#DestinationsNPosition').val();
    let Records = $('#selDataCoinsDestinations').html();
    return [Position, Records];
}

function fnChangeDataGroupDestinations(num: number) {
    $('#selDataCoinsDestinations').html(num);
    fnCleanDestinations();
    fnLoadDestinations();
}

function fnDestinationsDelete(id: number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro con id: "' + id + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'Destinations/DeleteDestinations';

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

                            fnLoadDestinations();

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

function fnCleanDestinations() {

}

//#endregion de Destinos

/*
 ##########################################################
 ######################## Objetivos #######################
 ##########################################################
 */

//#region Sección de Objetivos

function fnLoadGoals() {
    let url = ApiBackEndUrl + 'Goals/GetGoals';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionGoal();
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

                $("#TabGoalsT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_         = result[cont].goalsId;
                    var deadLine_   = result[cont].deadLine;
                    var branchId_   = result[cont].branchId;
                    var branchName_ = result[cont].branchName;
                    var sellerId_   = result[cont].sellerId;
                    var sellerName_ = result[cont].sellerName;
                    var amount_     = result[cont].amount;

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsGoals").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = branchId_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsGoals").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = sellerId_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsGoals").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = moment(deadLine_).format("DD-MM-YYYY");
                    newRow.append(newCell);
                    $("#rowsGoals").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = branchName_;
                    newRow.append(newCell);
                    $("#rowsGoals").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = sellerName_;
                    newRow.append(newCell);
                    $("#rowsGoals").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = amount_;
                    newRow.append(newCell);
                    $("#rowsGoals").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnGoalDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnGoalDelete(' + id_ + ')');

                    var btn2 = document.createElement("btnGoalUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnGoalUpdate(' + id_ + ')');

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsGoals").append(newRow);
                    //##################################

                    cont++;
                }

                //console.log(result);
                $('#spinnerGoals').hide();
            });
}

function fnPositionGoal() {
    let Position = 0;
    let Records = 0;

    Position = $('#GoalsNPosition').val();
    Records = $('#selDataGoalsGroup').html();
    return [Position, Records];
}

function fnAddGoal(origin: string) {
    fnCleanGoal();
    $('#ModalGoals').modal('show');
}

function fnChangeDataGroupGoals(num: number) {
    $('#selDataGoalsGroup').html(num);
    fnCleanGoal();
    fnLoadGoals();
}

function fnBtnSaveGoal() {
    let data = [];
    var obj = {};
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    var deadLine_ = $('#DpickerDateGoal').val();
    var branch_ = $('#SelectGoalBranch').val();
    var seller_ = $('#SelectGoalSeller').val();
    var amount_ = $('#TxtAmountGoal').val();
    var user_ = JSON.parse(dataWeb).userName;

    var selection_ = $("#selGoalSeller").is(":visible") ? "S" : "B";                     
    //Condición de si esta seleccionado vendedor o sucursal
    if (selection_ == "S") {
        branch_ = 0;
    }
    else {
        seller_ = 0;
    }

    if (deadLine_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacia la fecha.'
        });
        return;
    } else if (branch_ == "" && selection_ == "B") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe llenar todos los campos.'
        });
        return;
    } else if (seller_ == "" && selection_ == "S") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe llenar todos los campos.'
        });
        return;
    } else if (amount_ == "" || amount_ == "0.00") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe llenar todos los campos.'
        });
        return;
    }

    data.push({
        "id": 0,
        "deadLine": deadLine_,
        "branchId": branch_,
        "sellerId": seller_,
        "amount": amount_,        
        "insertUser": user_,
        "dateInsertUser": new Date(),
        "updateUser": "",
        "dateUpdateUser": new Date()
    });

    let url = ApiBackEndUrl + 'Goals/insertGoals';

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

                fnCleanGoal();
                fnLoadGoals();
            });
}

function fnCleanGoal() {
    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateGoal").val(TodayString);
    $('#SelectGoalSeller').empty();
    $('#SelectGoalBranch').empty();
    $('#TxtAmountGoal').val('');
    $('input[name="selectCase"]').prop('checked', false);
    $('#selGoalSeller').hide();
    $('#selGoalBranch').hide();
}

function fnGoalSelect(sel: string) {
    if (sel == 'S') {
        $('#selGoalSeller').show();
        $('#selGoalBranch').hide();
    }
    else {
        $('#selGoalSeller').hide();
        $('#selGoalBranch').show();
    }
}

function fnGoalDelete(id_:number) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro ' + id_ + ' definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'Goals/DeleteGoals';
            var dataWeb: any = sessionStorage.getItem("TecnoData");
            var idRecord = id_.toString();

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: idRecord,
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

                            fnLoadGoals();
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

//#endregion Sección de Objetivos

/*
 ##########################################################
 ######################## Graficos ########################
 ##########################################################
 */

//#region Grafico de vendedores con sus ventas

function fnReportGoals() {

    if ($('#DpickerReportGoalsIni').val() == undefined || $('#DpickerReportGoalsIni').val() == "") {

        var Today: Date = new Date();
        var initDateString: string = moment(Today).format("YYYY-MM") + "-01";
        var TodayString: string = moment(Today).format("YYYY-MM-DD");
        $("#DpickerReportGoalsIni").val(TodayString);

        $('#DpickerReportGoalsIni').val(initDateString);
        $('#DpickerReportGoalsEnd').val(TodayString);
    }
    

    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetSalesBySellers';
    var dateIni = $('#DpickerReportGoalsIni').val();
    var dateEnd = $('#DpickerReportGoalsEnd').val();

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                dateIni: dateIni,
                dateEnd: dateEnd,
                SellerId: "0",
                CoinId: "2",
                GroupBy: "b",
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                //$("#TabReportGoalsT > tbody").empty();
                //var cont = 0;

                ////console.log('fnSalesDetail(' + result[cont].DocNum + ',"' + result[cont].CarNumber + '")');

                //for (var j in result) {

                //    var sbName = result[cont].SBName;
                //    var amount = result[cont].Amount;
                //    //var amountToday = result[cont].UtilityToday;
                //    //var amountR = amount - amountToday;                    
                //    var utility = result[cont].Utility;
                //    var utilityToday = result[cont].UtilityToday;
                //    var utilityR = utility - utilityToday;                    
                //    var porcUtility = (utilityR / amount) * 100;
                //    var mkup = result[cont].Mkup;
                //    var objetive = result[cont].objetiveAmount;
                //    var reached = (utilityToday / objetive) * 100;
                //    var projected = result[cont].Projected;
                //    var projectedPorc = result[cont].ProjectedPorc;

                //    var newRow = document.createElement("tr");

                //    //Nombre de la sucursal
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = sbName;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);

                //    //Total de las ventas
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = amount.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);  

                //    //Total de la utilidad menos la del día actual del día
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = utilityR.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);  

                //    //Total de la utilidad del día
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = utilityToday.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);  

                //    //Porcentaje de la utilidad
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = porcUtility.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow); 

                //    //Mkup
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = mkup.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow); 

                //    //Utilidad en pesos
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = utility.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow); 

                //    //Objetivo
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = objetive.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow); 

                //    //Alcanzado
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = reached.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);

                //    //Proyectado
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = projected.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);

                //    //Proyectado porcentaje
                //    var newCell = document.createElement("td");
                //    newCell.innerHTML = projectedPorc.toLocaleString('en-US', { minimumFractionDigits: 2 });;
                //    newRow.append(newCell);
                //    $("#rowsReportGoals").append(newRow);

                //    cont++;

                //}

                ////console.log(result);

                $('#spinnerReports').hide();
            })
        .catch(error => {

            Swal.fire({
                icon: 'error',
                title: 'Se detecto un error!',
                text: 'Error en la solicitud al sitio remoto (API).' + 'error: ' + error
            });

        });
}

//Viene en el controlador
async function fnSalesBySellers() {
    let url = ApiBackEndUrl + 'CreditDocuments/GetSalesBySellers';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let data: any = [];

    let response = await fetch(url,
        {
            method: 'GET',
            headers: {
                dateIni: "2021-01-01",
                dateEnd: "2024-01-01",
                SellerId: "0",
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            async result => {               

                for (var i = 0; i < result.length; i++) {
                    var date = result[i].Date;
                    var sellerId = result[i].SellerId;
                    var amount = result[i].Amount;

                    data.push({
                        "date": date,
                        "sellerId": sellerId,
                        "amount": amount
                    });
                }

                return await data;
                                
            })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo consultar el registro',
                text: 'Hubo un error al intentar guardar el registro, error: ' + error
            });
        });

    return await response;
        
}

async function fnSalesGraph() {

    let serieResult = [];

    serieResult = [{
        name: 'Installation & Developers',
        data: [43934, 48656, 65165, 81827, 112143, 142383,
            171533, 165174, 155157, 161454, 154610]
    }, {
        name: 'Manufacturing',
        data: [24916, 37941, 29742, 29851, 32490, 30282,
            38121, 36885, 33726, 34243, 31050]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 30000, 16005, 19771, 20185, 24377,
            32147, 30912, 29243, 29213, 25663]
    }, {
        name: 'Operations & Maintenance',
        data: [null, null, null, null, null, null, null,
            null, 11164, 11218, 10077]
    }, {
        name: 'Other',
        data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
            17300, 13053, 11906, 10073]
    }];

    Highcharts.chart('SalesGraph', {

        title: {
            text: 'Ventas por vendedor con objetivo propuesto',
            align: 'left'
        },

        subtitle: {
            //text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>',
            //align: 'bootom'
        },

        yAxis: {
            title: {
                text: 'Ventas por vendedor'
            },
            plotLines: [{
                value: 160000,
                width: 2,
                color: '#FF0000',
                dashStyle: 'ShortDash',
                zIndex: 0,
                label: {
                    text: 'Objetivo'
                }
            }]
        },

        xAxis: {
            accessibility: {
                rangeDescription: 'Range: Quincenal'
            },
            title: {
                text: 'Fecha de venta'
            }

        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: serieResult,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}


//#endregion Grafico de vendedores con sus ventas

/*
 ##########################################################
 ######################## Feriados ########################
 ##########################################################
 */

//#region días feriados

function fnLoadHolidays() {
    let url = ApiBackEndUrl + 'Holidays/GetHolidays';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var position = fnPositionHolidays();
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

                $("#TabHolidaysT > tbody").empty();

                for (var j in result) {
                    var id_ = result[j].id;
                    var description_ = result[j].description;
                    var holidayDay_ = result[j].holidayDay;

                    var newRow = document.createElement("tr");

                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
                    newCell.style.display = 'none';
                    $("#rowsHolidays").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = moment(holidayDay_).format("DD-MM-YYYY"); 
                    newRow.append(newCell);
                    $("#rowsHolidays").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = description_;
                    newRow.append(newCell);
                    $("#rowsHolidays").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnHolidaysDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnHolidaysDelete(' + id_ + ')');

                    var btn2 = document.createElement("btnHolidaysUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnHolidaysUpdate(' + id_ + ')');

                    var newCell = document.createElement("td");
                    newCell.appendChild(btn1);
                    newCell.appendChild(btn2);
                    newRow.append(newCell);
                    $("#rowsHolidays").append(newRow);
                    //##################################
                }

                $('#spinnerHolidays').hide();
            });
}

function fnPositionHolidays() {
    let Position = $('#HolidaysNPosition').val();
    let Records = $('#selDataHolidaysGroup').html();
    return [Position, Records];
}

function fnAddHolidays() {
    fnCleanHolidays();
    $('#ModalHolidays').modal('show');
}

function fnHolidaysDelete(id: number) {
    let url = ApiBackEndUrl + 'Holidays/GetHolidays';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro con id: "' + id + '" definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
        if (result.isConfirmed) {
            let url = ApiBackEndUrl + 'Holidays/DeleteHolidays';
            var dataWeb: any = sessionStorage.getItem("TecnoData");

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: id.toString(),
                        Authorization: JSON.parse(dataWeb).token
                    }
                })
                .then(response => response.json())
                .then(
                    result => {

                        if (result == true) {

                            Swal.fire(
                                'Borrado!',
                                'Registro borrado satisfactoriamente.',
                                'success'
                            );

                            fnLoadHolidays(); 
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
                        'Error en la solicitud al sitio remoto (API). Error: ' + error,
                        'error'
                    )
                });

                       
        }


    })
}

function fnHolidaysUpdate(id: number) {

}

function fnChangeDataGroupHolidays(num: number) {
    $('#selDataHolidaysGroup').html(num);
    fnCleanHolidays();
    fnLoadHolidays();
}

function fnCleanHolidays() {
    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateHolidays").val(TodayString);
    $('#DescriptionHolidays').val('');
}

function fnBtnSaveHolidays() {
    let data = [];
    var obj = {};

    var holidayDay_ = $('#DpickerDateHolidays').val();
    var description_ = $('#DescriptionHolidays').val();
    let url = ApiBackEndUrl + 'Holidays/insertHolidays';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    if (holidayDay_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacia la fecha.'
        });
        return;
    } else if (description_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacia la descripción'
        });
        return;
    }

    data.push({
        "id": 0,
        "description": description_,
        "holidayDay": holidayDay_,
        "insertUser": (JSON.parse(dataWeb).userId).toString(),
        "dateInsertUser": new Date(),
        "updateUser": "",
        "dateUpdateUser": new Date()
    });

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

                fnCleanHolidays();
                fnLoadHolidays();
            });
}

//#endregion días feriados