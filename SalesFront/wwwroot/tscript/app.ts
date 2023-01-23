import { strict } from "assert";
import "jquery";
import * as bootstrap from "bootstrap";
declare let Swal: any;
declare let moment: any;

class linksApi {
    backEnd: string = "https://mlapp.tecnovoz.com.ar:8092/api/";
    frontEnd: string = "https://localhost:7119/";

    GetBackend(): any {
        enum ret {
            backEnd,
            frontEnd
        }

        return ret;
    }
}

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
                take: "1000"
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
                        case ApiBackEndUrl + 'Sellers/GetSellers':
                            option.val(result[cont].id);
                            option.text(result[cont].firstName + " " + result[cont].lastName);
                            break;
                        case ApiBackEndUrl + 'Branches/GetBranches':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
                            break;
                        case ApiBackEndUrl + 'Products/GetProducts':
                            option.val(result[cont].id);
                            option.text(result[cont].productName);
                            break;
                        case ApiBackEndUrl + 'Destinations/GetDestinations':
                            option.val(result[cont].id);
                            option.text(result[cont].description);
                            break;
                        default:
                    }

                    selectControl.append(option);
                    cont++;
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

//function setTwoNumberDecimal(e) {
//    this.value = parseFloat(this.value).toFixed(2);
//}

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

    var data = {
        "userName": user,
        "password": password
    }

    const request = new Request(ApiBackEndUrl + 'Account', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    fetch(request).then((response) => {


        saveLocalStorage(response);
        console.log("###### successful session !!! ######");

        var resp_: string = localStorage.getItem("cazaTokenData")!;

        let getToken = JSON.parse(resp_);
        //console.log(getToken["token"]);

        var tt = getToken["token"];

        $("#logInUser").val("");
        $("#logInPass").val("");

        $('#lblMessages').hide();

        var params = {
            token: getToken["token"],
            other_header: 'other_header'
        };

        var FrontEnd: string = "https://localhost:7119/";

        const principalWeb: string = FrontEnd + 'Principal';
       
        window.open(principalWeb, '_self');


    }).catch(error => {
        Swal.fire({
            icon: "error",
            title: "Error al consultar la API",
            text: error
        })
    });
}

function saveLocalStorage(data: any) {
    localStorage.setItem("cazaTokenData", JSON.stringify(data));
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
    $('#ModalClients').modal('show');
}

function fnLoadClients(skip: number, take: number) {

    let url = ApiBackEndUrl + 'Clients/GetClients';

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

                $("#TabClientsT > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var id_ = result[cont].id;
                    var name_ = result[cont].firstName;
                    var lName_ = result[cont].lastName;
                    var email1 = result[cont].email1;
                    var email2 = result[cont].email2;
                    var phone1 = result[cont].phone1;
                    var phone2 = result[cont].phone2;
                    var tDocument = result[cont].typeDocument;
                    var document_ = result[cont].documentNumber;

                    var newRow = document.createElement("tr");
                    var newCell = document.createElement("td");
                    newCell.innerHTML = id_;
                    newRow.append(newCell);
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
                    newCell.innerHTML = email2;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = phone1;
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = phone2;
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
                    btn.innerHTML = "Ver";
                    btn.classList.add("btnGrid");
                    btn.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")')
                    var newCell = document.createElement("td");
                    newCell.appendChild(btn);
                    newRow.append(newCell);
                    $("#rowsClient").append(newRow);

                    cont++;
                }

                console.log(result);
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

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Amount;
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    var btn = document.createElement("BUTTON");
                    btn.innerHTML = "Ver";
                    btn.classList.add("btnGrid");
                    btn.setAttribute('onclick', 'fnSalesDetail(' + result[cont].DocNum + ')')
                    var newCell = document.createElement("td");
                    newCell.appendChild(btn);
                    newRow.append(newCell);
                    $("#rowsSales").append(newRow);

                    cont++;
                }

                console.log(result);
            });
}

function fnCleanSale() {

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
                var cont = 0;

                for (var j in result) {

                    var newRow = document.createElement("tr");

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Product;
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Description;
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].Amount;
                    newRow.append(newCell);
                    $("#rowsSalesDetail").append(newRow);                    

                    cont++;
                }

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
    var Product_ = $('#SelectSaleDeailProduct').val();
    var From_ = $('#SelectSaleDeailFrom').val();
    var To_ = $('#SelectSaleDeailTo').val();
    var Amount_ = $('#TxtAmountSaleDetail').val();

    if (Product_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el producto'
        });
        return;
    } else if (From_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el origen'
        });
        return;
    } else if (To_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el destino'
        });
        return;
    } else if (Amount_ == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el monto'
        });
        return;
    }

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

//#endregion Secci�n de detalle de Ventas