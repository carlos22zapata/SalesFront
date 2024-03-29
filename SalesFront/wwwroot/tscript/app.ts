import { strict } from "assert";
import { Console, error } from "console";
import { Grid } from "ag-grid-community";
//import DevExpress from "ag-grid-community";
//import ExcelJS from "exceljs";
//import { Workbook } from "exceljs"
//import { exportDataGrid } from "devextreme/excel_exporter";
//import { saveAs } from "file-saver";


declare let Swal: any;
declare let moment: any;
declare let exportDataGrid: any;
declare let saveAs: any;
declare let $: any;
declare let Highcharts: any;
declare let mask: any;
declare let dxDataGrid: any;
declare let Workbook: any; 
declare let ExcelJS: any;
declare let excelExporter: any;
declare let DevExpress: any;

const iconDelete: string = '<i class="fa-solid fa-delete-left"></i>';
const iconUpdate: string = '<i class="fa-solid fa-pencil"></i>';

var timer: any;

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
//var ApiBackEndUrl: string = "https://mlapp.tecnovoz.com.ar:8092/api/";
//var FrontEnd = "https://mlapp.tecnovoz.com.ar:8090/";

//############ Server t7 ############
//var ApiBackEndUrl: string = "https://t7.tecnovoz.com.ar:8091/api/";
//var FrontEnd: string = "https://t7.tecnovoz.com.ar:8090/";

//############ Desarrollo ############
var ApiBackEndUrl: string = "https://mlapp.tecnovoz.com.ar:8092/api/";
var FrontEnd: string = "https://localhost:7119/";

/*
 ##########################################################
 ################### Funciones generales ##################
 ##########################################################
 */

//#region Funciones generales

//Funci�n para cargar todos los select
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
                        //case ApiBackEndUrl + 'Account/GetUserSeller':
                        //    //option.val(result[cont].userId);
                        //    $('#lblSaleSeller').html(result[cont].userId);
                        //    $('#TxtSaleSeller2').val(result[cont].firstName + " " + result[cont].lastName);
                        //    break;
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
            
}

//Funci�n encargada de abrir y cerrar el contenido del men� principal
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

function showNewSale() {
    hideAll();
    $("#first-menu").hide(100);
    $("#menu-principal-1").hide();
    $("#menu-principal-2").hide();
    $("#menu-principal-3").hide();

    $('#MasterSales').show();
    fnLoadSales();
    fnAddSales();
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
        var SearchValue = $('#TxtSaleClient2').val();
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

interface monthOfYears {
    [months: string]: number;
}

const months: monthOfYears = {
    "Enero": 1,
    "Febrero": 2,
    "Marzo": 3,
    "Abril": 4,
    "Mayo": 5,
    "Junio": 6,
    "Julio": 7,
    "Agosto": 8,
    "Septiembre": 9,
    "Octubre": 10,
    "Noviembre": 11,
    "Diciembre": 12
};

//#endregion Funciones generales

/*
 ##########################################################
 ########################## Login #########################
 ##########################################################
 */

//#region Secci�n de Login

function LogIn(user: string, password: string) {

    if (user == "") {
        $('#lblMessages').html("El nombre de usuario no debe estar vacio !!!");
        $('#lblMessages').show();
        return;
    }
    else if (password == undefined) {
        $('#lblMessages').html("La contrase�a no debe estar vac�a !!!");
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
            title: "Inicie sesi�n nuevamente",
            text: "Debe volver a iniciar sesi�n con su usuario y clave para poder seleccionar una sucursal!!!"
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
                    title: 'No se pudo completar la operaci�n!',
                    text: 'Hubo un error: ' + error
                });
            });
    }
    
}

//#endregion Secci�n de Login


/*
 ##########################################################
 ####################### Productos ########################
 ##########################################################
 */

//#region Secci�n de Productos

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
                    btn1.setAttribute('data-title', 'Borrar producto');

                    var btn2 = document.createElement("btnProductUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnProductUpdate(' + result[cont].id + ')')
                    btn2.setAttribute('data-title', 'Actualizar producto');

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
        confirmButtonText: 'S�, eliminar!'
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
                'Content-Type': 'application/json;charset=UTF-8',
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
                    text: 'Se guard� correctamente el registro'
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

//#endregion Secci�n de Productos


/*
 ##########################################################
 ######################## Clientes ########################
 ##########################################################
 */

//#region Secci�n de Clientes

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
                    var btn1 = document.createElement("btnClientDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");                    
                    btn1.setAttribute('onclick', 'fnProductDelete(' + result[cont].id + ')');
                    btn1.setAttribute('data-title', 'Eliminar registro de cliente');
                    
                    var btn2 = document.createElement("btnClientUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");                    
                    btn2.setAttribute('onclick', 'fnProductUpdate(' + result[cont].id + ')');
                    btn2.setAttribute('data-title', 'Actualizar registro de cliente');

                    var btn3 = document.createElement("btnSalesClients");
                    btn3.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i>';
                    btn3.classList.add("btnGridSalesClients");
                    btn3.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')
                    btn3.setAttribute('data-title', 'Ver las ventas del cliente');

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
                //        0: { sorter: false } // deshabilita el ordenamiento de la primera columna (n�meros)
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

    //$('#SellerSelectClient').empty();
    //fnLoadSelect('SellerSelectClient', 'Account/GetUserSeller');
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    $('#lblSaleSeller1').html(JSON.parse(dataWeb).userId);
    $('#TxtSaleSeller1').val(JSON.parse(dataWeb).SellerName);    
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
        else { //Busqueda b�sica

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

    
    //console.log(select);

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
                            var btn1 = document.createElement("btnClientDelete");
                            btn1.innerHTML = iconDelete;
                            btn1.classList.add("btnGridDelete");
                            btn1.setAttribute('onclick', 'fnProductDelete(' + result[cont].id + ')');
                            btn1.setAttribute('data-title', 'Eliminar registro de cliente');

                            var btn2 = document.createElement("btnClientUpdate");
                            btn2.innerHTML = iconUpdate;
                            btn2.classList.add("btnGridUpdate");
                            btn2.setAttribute('onclick', 'fnProductUpdate(' + result[cont].id + ')');
                            btn2.setAttribute('data-title', 'Actualizar registro de cliente');

                            var btn3 = document.createElement("btnSalesClients");
                            btn3.innerHTML = '<i class="fa-solid fa-file-invoice-dollar"></i>';
                            btn3.classList.add("btnGridSalesClients");
                            btn3.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')
                            btn3.setAttribute('data-title', 'Ver las ventas del cliente');

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
                            btn1.setAttribute('data-title', 'Ventas del cliente');

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

    $('#TxtSaleClient2').val(name);
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
    var sellersId = $('#lblSaleSeller1').html(); //$('#SellerSelectClient').val();

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
            text: 'Debe incluir al menos un correo electr�nico.'
        });
        return;
    }
    else if (phone1 == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir al menos un tel�fono v�lido.'
        });
        return;
    }
    else if (documentNumber == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir el n�mero de documento.'
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
                'Content-Type': 'application/json;charset=UTF-8',
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
                    $('#TxtSaleClient2').val(fName + ' ' + sName);
                    $('#lblSaleClient').html(result.id);
                }
                else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Registro agregado exitosamente!',
                        text: 'Se guard� correctamente el registro'
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
    else if ($("#MasterClients").is(":visible")) { //Si esta visible la secci�n de los clientes
        Position = $('#ClientsNPosition').val();
        Records = $('#selDataGroup').html();
    }
    
    return [Position, Records];
}

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
        confirmButtonText: 'S�, eliminar!'
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

$("#TxtSaleSeller1").keyup(function () {
    clearTimeout(timer);

    timer = setTimeout(function () {
        var seller_ = $("#TxtSaleSeller1").val();
        var searchResults = $('#SearchResultsSaleSeller1');

        if (seller_ != "") {
            let url = ApiBackEndUrl + 'Account/DynamicGetUserSeller';
            var dataWeb: any = sessionStorage.getItem("TecnoData");
            var select = "select * from Users where FirstName + ' ' + LastName like('%" + seller_ + "%')";
            var skip = 1;
            var take = 10;

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
                        //console.log(result);

                        // Mostrar los resultados en una lista debajo del input text
                        searchResults.empty();
                        var idSeller = 0;

                        for (const result_ of result) {
                            idSeller++;
                            const li = document.createElement('li');
                            li.id = idSeller.toString();
                            li.setAttribute('idSaleSellerC', result_.userId);
                            li.textContent = result_.firstName + ' ' + result_.lastName;
                            searchResults.append(li);

                            //console.log(li);
                        }
                    });

            //console.log(cliente_);
        }
        else {
            searchResults.empty();
        }
    }, 500)

});

$('#SearchResultsSaleSeller1').on('click', 'li', function (this: HTMLElement) {
    var searchResults = $('#SearchResultsSaleSeller1');
    var text = $(this).text();
    var id = $(this).attr('idSaleSellerC');
    $("#TxtSaleSeller1").val(text);
    $("#lblSaleSeller1").text(id);
    searchResults.empty();
});

//#region campos de busqueda

const txtNameCliente = $('#TxtFirstNameCliente');
const resultsNameCliente = $('#results');

txtNameCliente.on('input', async () => {
    let url = ApiBackEndUrl + 'Clients/GetClientsByFullName';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    const value = txtNameCliente.val(); 
    //console.log(value);

    if (value != '' || value != undefined) {
        const response = await fetch(url, {
            headers: {
                'name': value,
                Authorization: JSON.parse(dataWeb).token
            }
        });
        const data = await response.json();
        //const filteredData = data.filter((client: string) => client.startsWith(value));

        // Limpiar los resultados anteriores
        resultsNameCliente.empty();

        if (data.length > 0) {
            // Mostrar los nuevos resultados
            data.forEach((cliente: string) => {
                const result = $('<div>').text(cliente);
                result.on('click', () => {
                    txtNameCliente.val(cliente);
                    resultsNameCliente.empty();
                });
                resultsNameCliente.append(result);

                //console.log(result);
            });
        }
    }
    
});

//#endregion campos de busquedaz

//#endregion Secci�n de Clientes


/*
 ##########################################################
 ####################### Vendedores #######################
 ##########################################################
 */

//#region Secci�n de Vendedores

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
    $('#lblSaleSeller').html('');
    $('#TxtSaleSeller2').val('');
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
            text: 'Debe incluir al menos un correo electr�nico.'
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
            text: 'Debe incluir el n�mero de documento.'
        });
        return;
    }
    else if (branchId == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Debe incluir el n�mero de sucursal.'
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
                    'application/json;charset=UTF-8'
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
                        text: 'No se guard� correctamente el registro'
                    });

                    return;
                }


                Swal.fire({
                    icon: 'info',
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guard� correctamente el registro'
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

$('#SearchResultsSaleSeller').on('click', 'li', function (this: HTMLElement) {
    var searchResults = $('#SearchResultsSaleSeller');
    var text = $(this).text();
    var id = $(this).attr('idSaleSeller');
    $("#TxtSaleSeller2").val(text);
    $("#lblSaleSeller").text(id);
    searchResults.empty();
});

$("#TxtSaleSeller2").keyup(function () {
    clearTimeout(timer);

    timer = setTimeout(function () {
        var seller_ = $("#TxtSaleSeller2").val();
        var searchResults = $('#SearchResultsSaleSeller');

        if (seller_ != "") {
            let url = ApiBackEndUrl + 'Account/DynamicGetUserSeller';
            var dataWeb: any = sessionStorage.getItem("TecnoData");
            var select = "select * from Users where FirstName + ' ' + LastName like('%" + seller_ + "%')";
            var skip = 1;
            var take = 10;

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
                        //console.log(result);

                        // Mostrar los resultados en una lista debajo del input text
                        searchResults.empty();
                        var idSeller = 0;

                        for (const result_ of result) {
                            idSeller++;
                            const li = document.createElement('li');
                            li.id = idSeller.toString();
                            li.setAttribute('idSaleSeller', result_.userId);
                            li.textContent = result_.firstName + ' ' + result_.lastName;
                            searchResults.append(li);

                            //console.log(li);
                        }
                    });

            //console.log(cliente_);
        }
        else {
            searchResults.empty();
        }
    }, 500)

});

//#endregion Secci�n de Vendedores

/*
 ##########################################################
 ######################### Ventas #########################
 ##########################################################
 */

//#region Secci�n de Ventas

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
    var SaleSeller = $('#lblSaleSeller').html();
    var SaleChannel = $('#SelectSaleChannel').val();
    var SaleBranch = $('#SelectSaleBranch').val();
    var SaleCoin = $('#SelectSaleCoin').val();
    var CommentSale = $('#TxtCommentSale').val();

    if (!validarInputNumber($('#TxtNumberSale').val())) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'El formato del n�mero de carrito no es correcto'
        });
        return;
    }
    else if (DateSale == "") {
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
            text: 'No puede estar vacio el n�mero de carrito.'
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
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization: JSON.parse(dataWeb).token
            },
            body: JSON.stringify(data[0])

        })
        .then(
            response => response.json())
        .then(
            async result => {
                var id_ = result.id;
                var shoppingCarNumber_ = result.shoppingCarNumber;

                fnCleanSale();
                fnLoadSales();
                $('#lblCarNumber').html(shoppingCarNumber_);
                $('#TxtIdSaleDetail').val(id_);
                $('#TxtCarNumberSale').val(shoppingCarNumber_);
                await fnLoadSalesDetail(id_, shoppingCarNumber_);
                fnAddSalesDetail(true);
                $('#ModalSales').modal('hide');
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
                SellerId: JSON.parse(dataWeb).userId,
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
                    newCell.innerHTML = Math.floor(result[cont].Amount).toLocaleString();
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnSaleDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnSalesDelete(' + result[cont].DocNum + ')');
                    btn1.setAttribute('data-title', 'Borrar venta');

                    var btn2 = document.createElement("btnDetailSaleDetail");
                    btn2.innerHTML = '<i class="fa-solid fa-cart-flatbed-suitcase"></i>';
                    btn2.classList.add("btnGridSalesClients");
                    btn2.setAttribute('onclick', 'fnSalesDetail(' + result[cont].DocNum + ',"' + result[cont].CarNumber + '")');
                    btn2.setAttribute('data-title', 'Ver detalle de la venta');

                    var btn3 = document.createElement("btnSalePayment");
                    btn3.innerHTML = '<i class="fa-solid fa-circle-dollar-to-slot"></i>';
                    btn3.classList.add("btnGridUpdate");
                    btn3.setAttribute('onclick', 'fnSalesPayment(' + result[cont].DocNum + ',' + result[cont].Amount + ')')
                    btn3.setAttribute('data-title', 'Agregar pago');

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
        confirmButtonText: 'S�, eliminar!'
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
    $('#TxtAmountSale').val('0');
    //$('#TxtSaleClient').val('');

    //$('#SelectSaleSeller').empty();
    //fnLoadSelect('TxtSaleSeller2', 'Account/GetUserSeller');

    //Establece el vendedor por defecto
    $('#lblSaleSeller').html(JSON.parse(dataWeb).userId);
    $('#TxtSaleSeller2').val(JSON.parse(dataWeb).SellerName);

    $('#SelectSaleChannel').empty();
    $('#SelectSaleBranch').empty();
    fnLoadSelect('SelectSaleBranch', 'Branches/GetBranches');
    $('#SelectSaleCoin').empty();
    fnLoadSelect('SelectSaleCoin', 'Coins/GetCoins')
    $('#TxtCommentSale').val('');
    $('#TxtNumberSale').val('');
    $('#lblNumberSale').hide();
    $('#lblNumberSaleOk').hide();

    $('#lblSaleClient').html('');
    $('#TxtSaleClient2').val('');
    $('#SearchResultsClients').empty();
       
    $('#SearchResultsSaleSeller').empty();
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

//function validateInput(e: any) {
//    var key = window.Event ? e.which : e.keyCode
//    return (key >= 48 && key <= 57)
//}

//function validateNumberSale() {
//    const lblLength = $('#TxtNumberSale').val().length;
//    if (lblLength == 9)
//        return true;
//    else
//        return false;
//}

function validarInputNumber(inputText: string) {
    var regex = /^[0-9]{3}-[0-9]{3}-[0-9]{3}$/;
    var resultX = regex.test(inputText);

    if (!resultX) {
        regex = /^[0-9]{9}$/;
        if (regex.test(inputText)) {
            $('#TxtNumberSale').val(inputText.slice(0, 3) + '-' + inputText.slice(3, 6) + '-' + inputText.slice(6));
            resultX = true;
        }
        
    }

    return resultX;
}

function lostFocusNumberSale() {

    var valid = validarInputNumber($('#TxtNumberSale').val());

    if (!valid) {
        $('#lblNumberSale').show();
        $('#lblNumberSaleOk').hide();
    }
    else {
        $('#lblNumberSale').hide();
        $('#lblNumberSaleOk').show();
    }
}

$('#SearchResultsClients').on('click', 'li', function (this: HTMLElement) {
    var searchResults = $('#SearchResultsClients');
    var text = $(this).text();
    var id = $(this).attr('idClient');
    $("#TxtSaleClient2").val(text);
    $("#lblSaleClient").text(id);
    searchResults.empty();
});

var timer: any;
$("#TxtSaleClient2").keyup(function () {
    clearTimeout(timer);

    timer = setTimeout(function () {
        var cliente_ = $("#TxtSaleClient2").val();
        var searchResults = $('#SearchResultsClients');

        if (cliente_ != "") {
            let url = ApiBackEndUrl + 'Clients/DynamicGetClientsSelect';
            var dataWeb: any = sessionStorage.getItem("TecnoData");
            var select = "select * from Clients where FirstName + ' ' + LastName like('%" + cliente_ + "%') or DocumentNumber like('%" + cliente_ + "%') or email1 like('%" + cliente_ + "%')";
            var skip = 1;
            var take = 10;

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
                        //console.log(result);

                        // Mostrar los resultados en una lista debajo del input text
                        searchResults.empty();
                        var idClient = 0;

                        for (const result_ of result) {
                            idClient++;
                            const li = document.createElement('li');
                            li.id = idClient.toString();
                            li.setAttribute('idClient', result_.id);
                            li.setAttribute('data-title', 'DNI: ' + result_.documentNumber + ', Correo: ' + result_.email1);
                            li.textContent = result_.firstName + ' ' + result_.lastName;
                            searchResults.append(li);

                            //console.log(li);
                        }
                    });

            //console.log(cliente_);
        }
        else {
            searchResults.empty();
        }
    }, 500)

});

//#endregion Secci�n de Ventas

//#region Secci�n de detalle de Ventas

function fnSalesDetail(DocNum: number, CarNumber: string) {
    $('#lblCarNumber').html(DocNum.toString());
    $('#TxtIdSaleDetail').val(DocNum.toString());
    $('#TxtCarNumberSale').val(CarNumber);
    //fnChangeSelect();
    fnLoadSalesDetail(DocNum, CarNumber);
}

//Carga los registros en el datagrid
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

                    var amount: number = Math.floor(result[cont].Amount);
                    var utility: number = Math.floor(result[cont].Utility);
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
                    newCell.innerHTML = amount.toLocaleString();
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = utility.toLocaleString();
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = mkup.toLocaleString();
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow); 

                    //Creo los dos botones para la tabla
                    var btn1 = document.createElement("btnDetailSaleDelete");
                    btn1.innerHTML = iconDelete;
                    btn1.classList.add("btnGridDelete");
                    btn1.setAttribute('onclick', 'fnSalesDetailDelete(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')')
                    btn1.setAttribute('data-title', 'Borrar detalle de la venta');

                    var btn2 = document.createElement("btnDetailSaleUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnSalesDetailUpdate(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')')
                    btn2.setAttribute('data-title', 'Actualizar registro de venta');

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
                $('#lblCarNumber').html(CarNumber + " - renglones: " + cont + " - total: " + total.toLocaleString('en-US', { minimumFractionDigits: 0 }));
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
        confirmButtonText: 'S�, eliminar!'
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

    $('#lblSalesDetailId').html(carItem.toString());    
    await fnLoadSelect('SelectSaleDeailProduct', 'Products/GetProducts');

    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsById';
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var roleId = JSON.parse(dataWeb).RoleId;

    var isAdmin = false;

    if (roleId == 1) {
        $("#SectionAudit").show();
        isAdmin = true;
    }
    else {
        $("#SectionAudit").hide();
    }

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
                result = result[0];    
                var id_ = result.productsId;
                var date_ = (moment(result.travelDate).format('YYYY-MM-DD'));
                var destination_ = result.destinationsTo;
                var dname_ = result.destinationsToName;
                var amount_ = result.amount.toLocaleString();
                var utility_ = result.utility.toLocaleString('en-US', { minimumFractionDigits: 0 });
                var mkup_ = result.mkup.toLocaleString('en-US', { minimumFractionDigits: 0 });
                var audit_ = result.audit;

                if (!isAdmin && audit_) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'El registro esta auditado',
                        text: 'Este registro esta auditado por un administrador, si desea hacer un cambio debe solicitar el permiso al usuario que lo porces�...'
                    });
                    return;
                }

                $('#SelectSaleDeailProduct').val(id_);
                $('#DpickerDateSaleDetail').val(date_);
                //await $('#SelectSaleDeailFrom').val(result.destinationsFrom);
                $('#TxtSaleDeailTo').val(dname_);
                $('#lblSaleDeailTo').html(destination_);
                $('#TxtAmountSaleDetail').val(amount_);
                $('#TxtUtilitySaleDetail').val(utility_);
                $('#TxtMkupSaleDetail').val(mkup_);
                $('#chkAudit').prop("checked", audit_);

                fnAddSalesDetail(false);
            });

    

    
}

function fnAddSalesDetail(isNew: boolean) {

    if ($('#TxtIdSaleDetail').val() == "") {
        Swal.fire({
            icon: 'warning',
            title: 'No tiene carrito seleccionado',
            text: 'Seleccione un carrito para agregar un detalle'
        });

        return;
    }
    if (isNew) { //Si es un update
        $("#SectionAudit").hide();
        fnCleanSaleDetail();
    } 
        
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    var roleId = JSON.parse(dataWeb).RoleId;
            
    $('#ModalSalesDetail').modal('show');
}

function fnCleanSaleDetail() {

    var today: Date = new Date();

    $("#SelectSaleDeailProduct").empty();
    $('#DpickerDateSaleDetail').val(moment(today).format('YYYY-MM-DD'))
    $("#SelectSaleDeailTo").empty();
    $('#TxtAmountSaleDetail').val('0');
    $('#TxtUtilitySaleDetail').val('0');
    $('#TxtMkupSaleDetail').val('0');
    $('#lblSalesDetailId').html('');
    $('#TxtSaleDeailTo').val('');
    $('#SearchResultsSaleDeailTo').empty();
    $('#lblSaleDeailTo').html('');
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
    //var To_ = $('#TxtSaleDeailTo').val();
    var To_ = $('#lblSaleDeailTo').html();

    var AmountN = +$('#TxtAmountSaleDetail').val();
    var UtilityN = +$('#TxtUtilitySaleDetail').val();
    var MkupN = +$('#TxtMkupSaleDetail').val();

    var Amount_ = AmountN.toString().replace('.', '');
    var Utility_ = UtilityN.toString().replace('.', '');
    var Mkup_ = MkupN.toString().replace('.', '');

    var isUpdate: boolean = (SaleDetailId_ == "" ? false : true)

    if (Product_ == "" || Product_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'Atenci�n: No puede estar vacio el producto'
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
                    'Content-Type': 'application/json;charset=UTF-8',
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
                            text: 'Se guard� correctamente el registro'
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
                            text: 'Hubo un error, devolvi�: ' + result
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
                
        console.log(JSON.stringify(data[0]));

        let url = ApiBackEndUrl + 'ItemsCreditDocuments/updateItemsCreditDocuments';
        var audit_ = $("#chkAudit").prop('checked');

        let response = fetch(url,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    Audit: audit_.toString(),
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
                        text: 'Se guard� correctamente el cambio.'
                    });
                    $('#ModalSalesDetail').modal('hide');
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

$('#SearchResultsSaleDeailTo').on('click', 'li', function (this: HTMLElement) {
    var searchResults = $('#SearchResultsSaleDeailTo');
    var text = $(this).text();
    var id = $(this).attr('idDestiny');
    $("#TxtSaleDeailTo").val(text);
    $("#lblSaleDeailTo").text(id);
    searchResults.empty();
});

var timer: any;
$("#TxtSaleDeailTo").keyup(function () {
    clearTimeout(timer);

    timer = setTimeout(function () {
        var description = $("#TxtSaleDeailTo").val();
        var searchResults = $('#SearchResultsSaleDeailTo');

        if (description != "") {
            let url = ApiBackEndUrl + 'Destinations/DynamicGetDestinations';
            var dataWeb: any = sessionStorage.getItem("TecnoData");
            var select = "select * from Destinations where Description like('%" + description + "%')";
            var skip = 1;
            var take = 10;

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
                        //console.log(result);

                        // Mostrar los resultados en una lista debajo del input text
                        searchResults.empty();
                        var idClient = 0;

                        for (const result_ of result) {
                            idClient++;
                            const li = document.createElement('li');
                            li.id = idClient.toString();
                            li.setAttribute('idDestiny', result_.id);
                            li.textContent = result_.description;
                            searchResults.append(li);

                            //console.log(li);
                        }
                    });

            //console.log(cliente_);
        }
        else {
            searchResults.empty();
        }
    }, 500)

});

//#endregion Secci�n de detalle de Ventas

//#region Seccion de Pagos

function fnSalesPayment(num: number, amount: number) {
    fnCleanPayment(); 
    $('#btnSavePayment').show();
    $('#btnCleanPayment').show();
    $('#TxtIdPayment').val(num);
    $('#lblTotalOpr').html(amount.toLocaleString('en-US', { minimumFractionDigits: 0 }));
    $('#lblTotalOpr2').html(amount.toLocaleString('en-US', { minimumFractionDigits: 0 }));
    fnLoadPayment(num);
    $('#ModalPayment').modal('show');    
}

function fnBtnSavePayment() {

    var total_ = $('#lblTotalOpr').html();

    if (total_ != '0') {
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
                        //console.log("Tipo: " + typePay + ", Monto: " + amount + ", Sobre: " + envelope);

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
                                    'Content-Type': 'application/json;charset=UTF-8',
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
                                        text: 'Se guard� correctamente el registro'
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
    $('#TxtAmountPayment').val('0');
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
    amount = amountN.toLocaleString('en-US', { minimumFractionDigits: 0 });

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

    $('#TxtAmountPayment').val('0'); 
    $('#lblTotalOpr').html(totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0 }));
}

function fnPaymentRecordDelete(num: string, amount: number) {
    var total = $('#lblTotalOpr').html().replace('.', '').replace(',', '.');
    var balance: number = +total;
    balance = balance + amount;
    var record = $('#' + num);
    record.remove();
    $('#lblTotalOpr').html(balance.toLocaleString('en-US', { minimumFractionDigits: 0 }));
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
                    $('#lblTotalOpr').html('0')
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
        confirmButtonText: 'S�, eliminar!'
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

//#region Secci�n de Sucursales

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
                    btn1.setAttribute('data-title', 'Borrar sucursal');

                    var btn2 = document.createElement("btnBranchesUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnBranchesUpdate(' + id_ + ')')
                    btn2.setAttribute('data-title', 'Actualizar sucursal');

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
        confirmButtonText: 'S�, eliminar!'
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
            text: 'No puede estar vacio el correo electr�nico'
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

        //console.log("Insert: " + JSON.stringify(data[0]));

        let response = fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
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
                        text: 'Se guard� correctamente el registro'
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

        //console.log("Update: " + JSON.stringify(data[0]));

        let response = fetch(url,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
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
                        text: 'Se actualiz� correctamente el registro'
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

//#region Secci�n de Monedas

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
                    btn1.setAttribute('onclick', 'fnCoinsDelete(' + id_ + ')');
                    btn1.setAttribute('data-title', 'Borrar moneda');

                    var btn2 = document.createElement("btnCoinsUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnCoinsUpdate(' + id_ + ',"' + description_ + '")');
                    btn2.setAttribute('data-title', 'Actualizar moneda');

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
        confirmButtonText: 'S�, eliminar!'
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
                //console.log(result);
                return result;
            });
}

//#endregion de Monedas

//#region Secci�n de Historico de monedas

function fnCleanHistoryCoins() {
    var Today: Date = new Date();
    var TodayString: string = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateCoinHistory").val(TodayString);
    $('#TxtAmountCoinHistory').val('0');    
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
                    var value_ = result[cont].valueCoin.toLocaleString('en-US', { minimumFractionDigits: 0 });
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
        confirmButtonText: 'S�, eliminar!'
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

    //console.log(JSON.parse(dataWeb).token);

    let url = ApiBackEndUrl + 'CoinHistory/insertCoinHistory';

    let response = fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
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
                    text: 'Se guard� correctamente el registro'
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


//#endregion Secci�n de Historico de monedas

/*
 ##########################################################
 ######################## Destinos ########################
 ##########################################################
 */

//#region Secci�n de Destinos

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
                    btn1.setAttribute('data-title', 'Borrar destino');

                    var btn2 = document.createElement("btnDestinationsUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnDestinationsUpdate(' + id_ + ')')
                    btn2.setAttribute('data-title', 'Actualizar destino');

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
        confirmButtonText: 'S�, eliminar!'
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

//#region Secci�n de Objetivos

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
                    btn1.setAttribute('data-title', 'Borrar objetivo');

                    var btn2 = document.createElement("btnGoalUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnGoalUpdate(' + id_ + ')');
                    btn2.setAttribute('data-title', 'Actualizar objetivo');

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
    //Condici�n de si esta seleccionado vendedor o sucursal
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
    } else if (amount_ == "" || amount_ == "0") {
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
                'Content-Type': 'application/json;charset=UTF-8',
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
                    text: 'Se guard� correctamente el registro'
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
        confirmButtonText: 'S�, eliminar!'
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

//#endregion Secci�n de Objetivos

/*
 ##########################################################
 ################## Graficos y Reportes ###################
 ##########################################################
 */

//#region Grafico de vendedores con sus ventas

function fnRefreshReport() {

    if ($("#Report1").is(":visible")) {
        fnReportGoalsResume();
    }
    else if ($("#Report2").is(":visible")) {
        fnReportGoalsResumeMonth();
    }
    else if ($("#Report3").is(":visible")) {
        fnReportGoals();
    }
    else if ($("#Report4").is(":visible")) {
        fnReportGoalsResumeMonthColumns();
    }
    
}

function fnReportGoalsResumeMonth() {

    if ($('#gridSalesByMonth').is(':empty')) {


        var Today: Date = new Date();
        var initDateString: string = moment(Today).format("YYYY-MM") + "-01";
        var TodayString: string = moment(Today).format("YYYY-MM-DD");
        $("#DpickerReportGoalsIniR2").val(TodayString);

        $('#DpickerReportGoalsIniR2').val(initDateString);
        $('#DpickerReportGoalsEndR2').val(TodayString);
    }

    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetSalesByMonth';
    var dateIni = $('#DpickerReportGoalsIniR2').val();
    var dateEnd = $('#DpickerReportGoalsEndR2').val();

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                dateIni: dateIni,
                dateEnd: dateEnd,
                CoinId: "2",
                SellerId: JSON.parse(dataWeb).userId,
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                const dataGrid = $('#gridSalesByMonth').dxDataGrid({
                    dataSource: result,
                    keyExpr: 'ID',
                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    rowAlternationEnabled: true,
                    showBorders: true,
                    grouping: {
                        autoExpandAll: false,
                    },
                    export: {
                        enabled: true,
                    },
                    searchPanel: {
                        visible: true,
                    },
                    paging: {
                        pageSize: 20,
                    },
                    groupPanel: {
                        visible: true,
                    },
                    onExporting: function (e: any) {

                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet('Main sheet');

                        DevExpress.excelExporter.exportDataGrid({
                            worksheet: worksheet,
                            component: e.component
                        }).then(function () {
                            workbook.xlsx.writeBuffer().then(function (buffer: any) {
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte_por_mes.xlsx');
                            });
                        });
                        e.cancel = true;
                    },
                    columns: [
                        {
                            dataField: 'Month',
                            groupIndex: 0
                        },
                        { caption: 'Sucursal', dataField: 'BranchName' },
                        { caption: 'Vendedor', dataField: 'SellerName' },                        
                        { caption: 'Fecha', dataField: 'Date', dataType: 'date' },
                        //{ caption: 'Mes/a�o', dataField: 'Month' },
                        { caption: 'Monto', dataField: 'Amount', displayFormat: '{0:n0}' },

                    ],
                    sortByGroupSummaryInfo: [{
                        summaryItem: 'count',
                    }],
                    summary: {
                        groupItems: [{
                            column: 'ID',
                            summaryType: 'count',
                        },
                        {
                            column: 'Amount',
                            summaryType: 'sum',
                            valueFormat: 'currency',
                            //showInGroupFooter: true,
                            alignByColumn: true,
                        }],
                    }
                }).dxDataGrid('instance');

                $('#autoExpandR2').dxCheckBox({
                    value: false,
                    text: 'Expandir todos los grupos',
                    onValueChanged(data: any) {
                        dataGrid.option('grouping.autoExpandAll', data.value);
                    },
                });
            })

    
}

function fnReportGoalsResumeMonthColumns() {
    var selMonth = $('#montsSelect');
    var selYear = $('#yearSelect');
        
    var RegsSel = $('#montsSelect > option').length;

    if (RegsSel == 0) {
        var actualDate = new Date();
        var Month = actualDate.getMonth() + 1;
        var Year = actualDate.getFullYear();

        $.each(months, function (key: number, value: string) {
            selMonth.append($("<option></option>")
                .attr("value", value).text(key));
        });

        selMonth.val(Month);
        selYear.val(Year);

        $("#Sel1").prop("checked", true);
    }
    
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetSalesByMonthColumns';
    var dateIni = $('#DpickerReportGoalsIniR2').val();
    var dateEnd = $('#DpickerReportGoalsEndR2').val();

    var Month_ = selMonth.val();
    var Year_ = selYear.val();
    var includeSellers = $('#Sel1').is(':checked'); 

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                month: Month_.toString(),
                year: Year_.toString(),
                CoinId: "2",
                SellerId: JSON.parse(dataWeb).userId,
                IncludeSellers: includeSellers,
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabReport4 > tbody").empty();
                $('#TabReport4 th:nth-child(n+3), table td:nth-child(n+3)').remove();
                var cont = 0;

                var table = $('#TabReport4');

                var dayMonth = new Date(Year_, Month_, 0).getDate();
                var table = $('#TabReport4');

                for (var i = 1; i <= dayMonth; i++) {

                    var valDay = i < 10 ? '0' + i : i;
                    var valMon = Month_ < 10 ? '0' + Month_ : Month_;

                    table.find('thead tr').append('<th>' + valDay + "/" + valMon + '</th>');
                    table.find('tbody tr').append('<td></td>');
                }

                var IdAnt = 0;

                for (var j in result) {

                    var id_ = result[cont].ID;
                    var branchName = result[cont].BranchName == "ZZZZZZZ" ? "" : result[cont].BranchName;
                    var sellerName = result[cont].SellerName == "ZZZZZZZ" ? "Total: " : result[cont].SellerName;

                    if (!includeSellers) {
                        if (IdAnt != id_) {
                            var newRow = document.createElement("tr");
                            var newCell = document.createElement("td");
                            newCell.innerHTML = branchName;
                            newRow.append(newCell);
                            $("#rowsTabReport4").append(newRow);

                            var newCell = document.createElement("td");
                            newCell.innerHTML = sellerName;
                            newRow.append(newCell);
                            $("#rowsTabReport4").append(newRow);

                            for (var i = 1; i <= dayMonth; i++) {

                                var sale_ = moment(result[cont].Date, "YYYY-MM-DD").date() == i ? Math.floor(result[cont].Amount).toLocaleString() : '0'

                                var newCell = document.createElement("td");
                                newCell.innerHTML = sale_;
                                //$(newRow).find("td:nth-child(1)").css("width", "10%");
                                newRow.append(newCell);
                                $("#rowsTabReport4").append(newRow);
                            }
                        }

                        IdAnt = id_;
                    }
                    else {
                        var newRow = document.createElement("tr");
                        var newCell = document.createElement("td");
                        newCell.innerHTML = branchName;
                        newRow.append(newCell);
                        $("#rowsTabReport4").append(newRow);

                        var newCell = document.createElement("td");
                        newCell.innerHTML = sellerName;
                        newRow.append(newCell);
                        $("#rowsTabReport4").append(newRow);

                        for (var i = 1; i <= dayMonth; i++) {

                            var sale_ = moment(result[cont].Date, "YYYY-MM-DD").date() == i ? Math.floor(result[cont].Amount).toLocaleString() : '0'

                            var newCell = document.createElement("td");
                            newCell.innerHTML = sale_;
                            //$(newRow).find("td:nth-child(1)").css("width", "10%");
                            newRow.append(newCell);
                            $("#rowsTabReport4").append(newRow);
                        }
                    }

                    cont++;
                }

                

                /*
                $(() => {
                    $('#gridSalesByMonthColumns').dxPivotGrid({
                        //allowSortingBySummary: true,
                        //allowSorting: true,
                        //allowFiltering: true,
                        allowExpandAll: true,
                        height: 440,
                        showBorders: true,
                        keyExpr: 'ID',
                        //fieldChooser: {
                        //    enabled: false,
                        //},
                        dataSource: {
                            store: result,
                            fields: [{
                                caption: 'Sucursal',
                                width: 120,
                                dataField: 'BranchName',
                                area: 'row',
                            },
                            {
                                caption: 'Vendedor',
                                dataField: 'SellerName',
                                width: 150,
                                area: 'row',
                                //selector(data: any) {
                                //    return `${data.SellerName}`;
                                //},
                                },
                            {
                                caption: 'Fecha',
                                dataField: 'Date',
                                dataType: 'date',
                                area: 'column',
                            }, {
                                caption: 'Monto',
                                dataField: 'Amount',
                                dataType: 'number',
                                summaryType: 'sum',
                                format: 'currency',
                                area: 'data',
                            }],
                            
                        }
                    });
                });
                */
                
            });

    
}

function fnReportGoalsResume() {
    if ($('#DpickerReportGoalsIniR1').val() == undefined || $('#DpickerReportGoalsIniR1').val() == "") {

        var Today: Date = new Date();
        var initDateString: string = moment(Today).format("YYYY-MM-DD");
        var TodayString: string = moment(Today).format("YYYY-MM-DD");
        $("#DpickerReportGoalsIniR1").val(TodayString);

        $('#DpickerReportGoalsIniR1').val(initDateString);
        $('#DpickerReportGoalsEndR1').val(TodayString);
    }

    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetSalesByDate';
    var dateIni = $('#DpickerReportGoalsIniR1').val();
    var dateEnd = $('#DpickerReportGoalsEndR1').val();
    var userId = JSON.parse(dataWeb).userId;

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                dateIni: dateIni,
                dateEnd: dateEnd,
                CoinId: "2",
                SellerId: userId,
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                console.log(result);

                const dataGrid = $('#gridSalesByBranch').dxDataGrid({
                    dataSource: result,
                    keyExpr: 'ID',
                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    rowAlternationEnabled: true,
                    showBorders: true,                    
                    export: {
                        enabled: true,
                    },                    
                    onExporting: function (e: any) {                     

                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet('Main sheet');

                        DevExpress.excelExporter.exportDataGrid({
                            worksheet: worksheet,
                            component: e.component
                        }).then(function () {
                            workbook.xlsx.writeBuffer().then(function (buffer: any) {
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte_por_dia.xlsx');
                            });
                        });
                        e.cancel = true;
                    },
                    searchPanel: {
                        visible: true,
                    },
                    paging: {
                        pageSize: 40,
                    },        
                    columns: [
                        {
                            caption: 'Sucursal', dataField: 'BranchName', format: {
                                type: 'fixedPoint',
                                precision: 10,
                            },
                        },
                        { caption: 'Total Vendido', dataField: 'Total' }
                    ],
                    sortByGroupSummaryInfo: [{
                        summaryItem: 'count',
                    }],
                    summary: {
                        totalItems: [{
                            column: 'ID',
                            summaryType: 'count',
                        },
                        {
                            column: 'Total',
                            summaryType: 'sum',
                            valueFormat: 'currency',
                            //showInGroupFooter: true,
                            alignByColumn: true,
                        }],
                    }

                }).dxDataGrid('instance');

                dataGrid.columnOption(0, 'cellStyle', { 'color': 'red' });

                $('#spinnerReports').hide();
            });
}

function fnReportGoals() { //Report3

    if ($('#gridContainer').is(':empty')) {
        

        var Today: Date = new Date();
        var initDateString: string = moment(Today).format("YYYY-MM") + "-01";
        var TodayString: string = moment(Today).format("YYYY-MM-DD");
        $("#DpickerReportGoalsIniR3").val(TodayString);

        $('#DpickerReportGoalsIniR3').val(initDateString);
        $('#DpickerReportGoalsEndR3').val(TodayString);
    }
    
    var dataWeb: any = sessionStorage.getItem("TecnoData");
    let url = ApiBackEndUrl + 'CreditDocuments/GetSalesBySellers';
    var dateIni = $('#DpickerReportGoalsIniR3').val();
    var dateEnd = $('#DpickerReportGoalsEndR3').val();

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                dateIni: dateIni,
                dateEnd: dateEnd,
                CoinId: "2",
                SellerId: JSON.parse(dataWeb).userId,
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                                
                $("#TabReportGoalsT > tbody").empty();
                var cont = 0;

                //console.log(result);

                const dataGrid = $('#gridContainer').dxDataGrid({
                    dataSource: result,
                    keyExpr: 'ID',
                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    rowAlternationEnabled: true,
                    showBorders: true,
                    grouping: {
                        autoExpandAll: true,
                    },
                    export: {
                        enabled: true,
                    },
                    searchPanel: {
                        visible: true,
                    },
                    paging: {
                        pageSize: 40,
                    },
                    groupPanel: {
                        visible: true,
                    },
                    onExporting: function (e: any) {

                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet('Main sheet');

                        DevExpress.excelExporter.exportDataGrid({
                            worksheet: worksheet,
                            component: e.component
                        }).then(function () {
                            workbook.xlsx.writeBuffer().then(function (buffer: any) {
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte_por_gesti�n.xlsx');
                            });
                        });
                        e.cancel = true;
                    },
                    columns: [
                        {
                            dataField: 'Branch',
                            groupIndex: 0
                            //summaryType: 'sum',
                            //valueFormat: '{0:n2}',
                            //showInGroupHeader: true
                        },
                        { caption: 'Vendedor', dataField: 'SellerName'},
                        { caption: 'Groos B', dataField: 'GroosB', displayFormat: '{0:n0}' },
                        { caption: 'Groos MA', dataField: 'GroosMA' },
                        { caption: 'Groos MS', dataField: 'GroosMS' },
                        { caption: 'Mkup(%)', dataField: 'Mkup' },
                        { caption: 'Utilidad', dataField: 'Utility'},
                        { caption: 'Objetivo', dataField: 'Objetive'},
                        
                    ],
                    sortByGroupSummaryInfo: [{
                        summaryItem: 'count',
                    }],
                    summary: {
                        groupItems: [{
                                column: 'SellerName',
                                summaryType: 'count',
                            },
                            {
                                column: 'GroosB',
                                summaryType: 'sum',
                                valueFormat: 'currency',
                                //showInGroupFooter: true,
                                alignByColumn: true,
                            },
                            {
                                column: 'GroosMA',
                                summaryType: 'sum',
                                valueFormat: 'currency',
                                //showInGroupFooter: true,
                                alignByColumn: true,
                            },
                            {
                                column: 'GroosMS',
                                summaryType: 'sum',
                                valueFormat: 'currency',
                                //showInGroupFooter: true,
                                alignByColumn: true,
                            },
                            {
                                column: 'Utility',
                                summaryType: 'sum',
                                valueFormat: 'currency',
                                //showInGroupFooter: true,
                                alignByColumn: true,
                            }
                        ],
                    }
                }).dxDataGrid('instance');

                $('#autoExpand').dxCheckBox({
                    value: true,
                    text: 'Expandir todos los grupos',
                    onValueChanged(data: any) {
                        dataGrid.option('grouping.autoExpandAll', data.value);
                    },
                });

                //console.log(result);

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

function fnSelectReport() {
    var radios = document.getElementsByName('option');
    for (var i = 0; i < radios.length; i++) {
        if ((radios[i] as unknown as HTMLInputElement).checked) {
            var report = (radios[i] as unknown as HTMLInputElement).value;

            $('#Report1').hide();
            $('#Report2').hide();
            $('#Report3').hide();
            $('#Report4').hide();
            $('#' + report).show();

            if (report == 'Report1') {
                fnReportGoalsResume();
            }
            else if (report == 'Report2') {
                fnReportGoalsResumeMonth();
            }
            else if (report == 'Report3') {
                fnReportGoals();
            }
            else if (report == 'Report4') {
                fnReportGoalsResumeMonthColumns();
            }            

            break;
        }
    }
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
                SellerId: JSON.parse(dataWeb).userId,
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

//#region d�as feriados

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
                    btn1.setAttribute('data-title', 'Borrar feriado');

                    var btn2 = document.createElement("btnHolidaysUpdate");
                    btn2.innerHTML = iconUpdate;
                    btn2.classList.add("btnGridUpdate");
                    btn2.setAttribute('onclick', 'fnHolidaysUpdate(' + id_ + ')');
                    btn2.setAttribute('data-title', 'Actualizar feriado');

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
        confirmButtonText: 'S�, eliminar!'
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
            text: 'No puede estar vacia la descripci�n'
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
                'Content-Type': 'application/json;charset=UTF-8',
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
                    text: 'Se guard� correctamente el registro'
                });

                fnCleanHolidays();
                fnLoadHolidays();
            });
}

//#endregion d�as feriados