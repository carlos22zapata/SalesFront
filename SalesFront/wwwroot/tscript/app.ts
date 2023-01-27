import { strict } from "assert";
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

/*
 ##########################################################
 ################### Funciones generales ##################
 ##########################################################
 */

//#region Funciones generales

//Funci�n para cargar todos los select
function fnLoadSelect(nameControl: string, url: string) {
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    nameControl = '#' + nameControl;
    var selectControl = $(nameControl);

    //alert(selectControl[0].childNodes.length);

    if (selectControl[0].childNodes.length > 1)
        return;

    url = ApiBackEndUrl + url;

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: "0",
                take: "1000",
                Authorization: JSON.parse(dataWeb).token
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

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
                            option.val(result[cont].id);
                            option.text(result[cont].productName);
                            break;
                        case ApiBackEndUrl + 'Destinations/GetDestinations':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
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
        fnLoadClients(0, 5);
    if (divSelPrincipal == "MasterSellers")
        fnLoadSellers(0, 5);
    if (divSelPrincipal == "MasterSales")
        fnLoadSales(0, 5);
    if (divSelPrincipal == "MasterProducts")
        fnLoadProducts(0, 5);

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

function fnLoadProducts(skip: number, take: number) {

    let url = ApiBackEndUrl + 'Products/GetProducts';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip.toString(),
                take: take.toString(),
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
                    $("#rowsProducts").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].productName;
                    newRow.append(newCell);
                    $("#rowsProducts").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].price;
                    newRow.append(newCell);
                    $("#rowsProducts").append(newRow);

                    cont++;
                }
                console.log(result);
            });
}

function fnBtnSaveProduct() {
    let data = [];
    var obj = {};

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
        "price": ProductPrice        
    });

    let url = ApiBackEndUrl + 'Products/insertProduct';

    let response = fetch(url,
        {
            method: 'POST',
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
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guard� correctamente el registro'
                });

                fnCleanProducts();
                fnLoadProducts(0, 100);
            })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar el registro',
                text: 'Hubo un error al intentar guardar el registro, error: ' + error
            });
        });
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

function fnAddClient() {
    fnCleanClient();
    $('#ModalClients').modal('show');
}

function fnLoadClients(skip: number, take: number) {

    let url = ApiBackEndUrl + 'Clients/GetClients';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip.toString(),
                take: take.toString(),
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

                console.log(result);
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

//#endregion Secci�n de Clientes


/*
 ##########################################################
 ####################### Vendedores #######################
 ##########################################################
 */

//#region Secci�n de Vendedores

function fnLoadSellers(skip: number, take: number) {

    let url = ApiBackEndUrl + 'Sellers/GetSellers';
    var dataWeb: any = sessionStorage.getItem("TecnoData");

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip.toString(),
                take: take.toString(),
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

                console.log(result);
            });
}

function fnAddSeller() {
    $('#Modalsellers').modal('show');
}

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

    let response = fetch(url,
        {
            method: 'POST',
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
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guard� correctamente el registro'
                });

                fnCleanSale();
                fnLoadSales(0, 100);
            });
}

function fnLoadSales(skip: number, take: number) {
    
    let url = ApiBackEndUrl + 'CreditDocuments/GetCreditDocumentsClients';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip.toString(),
                take: take.toString()
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabSalesT > tbody").empty();
                var cont = 0;

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
                    newCell.innerHTML = result[cont].DocNum;
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var btn = document.createElement("btnDetailSale");
                    btn.innerHTML = '<i class="fa-solid fa-cart-flatbed-suitcase"></i>';
                    btn.classList.add("btnGrid");
                    btn.setAttribute('onclick', 'fnSalesDetail(' + result[cont].DocNum + ')')
                    var newCell = document.createElement("td");
                    newCell.appendChild(btn);
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    cont++;
                }

                console.log(result);

                $('#spinnerSales').hide();
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
}

//#endregion Secci�n de Ventas


//#region Secci�n de detalle de Ventas

function fnSalesDetail(DocNum: number) {
    $('#lblCarNumber').html(DocNum.toString());
    $('#TxtIdSaleDetail').val(DocNum.toString());

    fnLoadSalesDetail(DocNum);
}

function fnLoadSalesDetail(CreditDocumentId: number) {
    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsDetail';
    $('#spinnerSalesDetail').show();

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                CreditDocumentId: CreditDocumentId.toString()
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabSalesDetailT > tbody").empty();
                var cont:number = 0;
                var total: number = 0;

                for (var j in result) {

                    var amount: number = result[cont].Amount;

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
                $('#lblCarNumber').html(CreditDocumentId + " - renglones: " + cont + " - total: " + total.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                $('#spinnerSalesDetail').hide();

                console.log(result);
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
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro id:' + carItem + ' del carrito id:' + carNum + ' definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'S�, eliminar!'
    }).then((result:any) => {
        if (result.isConfirmed) {

            let url = ApiBackEndUrl + 'ItemsCreditDocuments/deleteItemsCreditDocuments';

            let response = fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        id: carItem.toString()
                    }
                })
                .then(response => response.json())
                .then(
                    result => {

                        if (result == true) {

                            fnLoadSalesDetail(carNum);

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

function fnSalesDetailUpdate(carNum: number, carItem: number) {

    $('#lblSalesDetailId').html(carItem.toString());
    fnAddSalesDetail();
    fnLoadSelect('SelectSaleDeailProduct', 'Products/GetProducts');
    fnLoadSelect('SelectSaleDeailFrom', 'Destinations/GetDestinations');
    fnLoadSelect('SelectSaleDeailTo', 'Destinations/GetDestinations');

    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsById';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                id: carItem.toString()
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                $('#SelectSaleDeailProduct').val(result.productsId);
                $('#SelectSaleDeailFrom').val(result.destinationsFrom);
                $('#SelectSaleDeailTo').val(result.destinationsTo);
                $('#TxtAmountSaleDetail').val(result.total.toLocaleString('de-DE', { minimumFractionDigits: 2 }));
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

    $('#ModalSalesDetail').modal('show');
}

function fnCleanSaleDetail() {
    $("#SelectSaleDeailProduct").empty();
    $("#SelectSaleDeailFrom").empty();
    $("#SelectSaleDeailTo").empty();
    $('#TxtAmountSaleDetail').val('0,00');
}

function fnBtnSaveSaleDetail() {
    let data = [];
    var obj = {};
    
    var SaleId_ = $('#TxtIdSaleDetail').val();
    var SaleDetailId_ = $('#lblSalesDetailId').html();
    var Product_ = $('#SelectSaleDeailProduct').val();
    var From_ = $('#SelectSaleDeailFrom').val();
    var To_ = $('#SelectSaleDeailTo').val();
    var Amount_ = $('#TxtAmountSaleDetail').val();

    var isUpdate: boolean = (SaleDetailId_ == "" ? false : true)

    if (Product_ == "" || Product_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el producto'
        });
        return;
    } else if (From_ == "" || From_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el origen'
        });
        return;
    } else if (To_ == "" || To_ == null) {
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
    }

    if (!isUpdate) {

        data.push({
            "id": 0,
            "creditDocumentsId": SaleId_,
            "productsId": Product_,
            "destinationsTo": To_,
            "destinationsFrom": From_,
            "total": Amount_
        });

        console.log(JSON.stringify(data[0]))

        let url = ApiBackEndUrl + 'ItemsCreditDocuments/insertItemsCreditDocuments';

        let response = fetch(url,
            {
                method: 'POST',
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
                        title: 'Registro agregado exitosamente!',
                        text: 'Se guard� correctamente el registro'
                    });

                    fnCleanSaleDetail();
                    fnLoadSalesDetail(Number(SaleId_));
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
            "productsId": Product_,
            "destinationsTo": To_,
            "destinationsFrom": From_,
            "total": Amount_
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
                        text: 'Se guard� correctamente el cambio.'
                    });

                    fnCleanSaleDetail();
                    fnLoadSalesDetail(Number(SaleId_));
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

//#endregion Secci�n de detalle de Ventas