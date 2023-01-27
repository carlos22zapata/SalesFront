"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var ApiBackEndUrl = "https://mlapp.tecnovoz.com.ar:8092/api/";
var FrontEnd = "https://localhost:7119/";
function fnLoadSelect(nameControl, url) {
    var dataWeb = sessionStorage.getItem("TecnoData");
    nameControl = '#' + nameControl;
    var selectControl = $(nameControl);
    if (selectControl[0].childNodes.length > 1)
        return;
    url = ApiBackEndUrl + url;
    let response = fetch(url, {
        method: 'GET',
        headers: {
            skip: "0",
            take: "1000",
            Authorization: JSON.parse(dataWeb).token
        }
    })
        .then(response => response.json())
        .then(result => {
        selectControl.empty();
        var cont = 0;
        for (var j in result) {
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
function showDiv(divSelPrincipal) {
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
function fnExpandMenu(n) {
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
    }
    else {
        $("#first-menu").show(100);
    }
}
function hideAll() {
    $('.divMaster').hide();
}
function LogIn(user, password) {
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
    let response = fetch(url, {
        method: 'GET',
        headers: {
            passwordLogin: password,
            userLogin: user
        }
    })
        .then(response => response.json())
        .then(result => {
        sessionStorage.setItem("TecnoData", JSON.stringify(result));
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
function LogInSucursal() {
    return __awaiter(this, void 0, void 0, function* () {
        const principalWeb = FrontEnd + 'Principal';
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
        yield window.open(principalWeb, '_self');
    });
}
function fnSelectUserBranch() {
    var dataWeb = sessionStorage.getItem("TecnoData");
    var userId = JSON.parse(dataWeb).userId;
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
        let response = fetch(url, {
            method: 'GET',
            headers: {
                UserId: userId.toString(),
                Authorization: JSON.parse(dataWeb).token
            }
        })
            .then(response => response.json())
            .then(result => {
            var SelectUserBranch = $('#SelectUserBranch');
            SelectUserBranch.empty();
            for (var j in result) {
                var option = $(document.createElement("option"));
                option.val(result[j].BranchesId);
                option.text(result[j].Description);
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
function fnAddProduct() {
    $('#ModalProducts').modal('show');
}
function fnLoadProducts(skip, take) {
    let url = ApiBackEndUrl + 'Products/GetProducts';
    var dataWeb = sessionStorage.getItem("TecnoData");
    let response = fetch(url, {
        method: 'GET',
        headers: {
            skip: skip.toString(),
            take: take.toString(),
            Authorization: JSON.parse(dataWeb).token
        }
    })
        .then(response => response.json())
        .then(result => {
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
    }
    else if (ProductPrice == "") {
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
    let response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            mode: 'no-cors'
        },
        body: JSON.stringify(data[0])
    })
        .then(response => response.json())
        .then(result => {
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
function fnAddClient() {
    fnCleanClient();
    $('#ModalClients').modal('show');
}
function fnLoadClients(skip, take) {
    let url = ApiBackEndUrl + 'Clients/GetClients';
    var dataWeb = sessionStorage.getItem("TecnoData");
    let response = fetch(url, {
        method: 'GET',
        headers: {
            skip: skip.toString(),
            take: take.toString(),
            Authorization: JSON.parse(dataWeb).token
        }
    })
        .then(response => response.json())
        .then(result => {
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
            btn.setAttribute('onclick', 'fnSalesClient(' + id_ + ',"' + name_ + ' ' + lName_ + '","' + tDocument + ':' + document_ + '")');
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
function fnLoadSellers(skip, take) {
    let url = ApiBackEndUrl + 'Sellers/GetSellers';
    var dataWeb = sessionStorage.getItem("TecnoData");
    let response = fetch(url, {
        method: 'GET',
        headers: {
            skip: skip.toString(),
            take: take.toString(),
            Authorization: JSON.parse(dataWeb).token
        }
    })
        .then(response => response.json())
        .then(result => {
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
    }
    else if (SaleClient == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el cliente.'
        });
        return;
    }
    else if (SaleSeller == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el vendedor.'
        });
        return;
    }
    else if (SaleChannel == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el canal.'
        });
        return;
    }
    else if (SaleBranch == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio la sucursal.'
        });
        return;
    }
    else if (SaleCoin == "") {
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
    let url = ApiBackEndUrl + 'CreditDocuments/insertCreditDocuments';
    let response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            mode: 'no-cors'
        },
        body: JSON.stringify(data[0])
    })
        .then(response => response.json())
        .then(result => {
        Swal.fire({
            icon: 'info',
            title: 'Registro agregado exitosamente!',
            text: 'Se guard� correctamente el registro'
        });
        fnCleanSale();
        fnLoadSales(0, 100);
    });
}
function fnLoadSales(skip, take) {
    let url = ApiBackEndUrl + 'CreditDocuments/GetCreditDocumentsClients';
    let response = fetch(url, {
        method: 'GET',
        headers: {
            skip: skip.toString(),
            take: take.toString()
        }
    })
        .then(response => response.json())
        .then(result => {
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
            btn.setAttribute('onclick', 'fnSalesDetail(' + result[cont].DocNum + ')');
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
    var dataWeb = sessionStorage.getItem("TecnoData");
    var Today = new Date();
    var TodayString = moment(Today).format("YYYY-MM-DD");
    $("#DpickerDateSale").val(TodayString);
    $('#TxtAmountSale').val('0,00');
    $('#SelectSaleClient').empty();
    $('#SelectSaleSeller').empty();
    fnLoadSelect('SelectSaleSeller', 'Account/GetUserSeller');
    $('#SelectSaleChannel').empty();
    $('#SelectSaleBranch').empty();
    fnLoadSelect('SelectSaleBranch', 'Branches/GetBranches');
    $('#SelectSaleCoin').empty();
    fnLoadSelect('SelectSaleCoin', 'Coins/GetCoins');
    $('#TxtCommentSale').val('');
}
function fnSalesDetail(DocNum) {
    $('#lblCarNumber').html(DocNum.toString());
    $('#TxtIdSaleDetail').val(DocNum.toString());
    fnLoadSalesDetail(DocNum);
}
function fnLoadSalesDetail(CreditDocumentId) {
    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsDetail';
    $('#spinnerSalesDetail').show();
    let response = fetch(url, {
        method: 'GET',
        headers: {
            CreditDocumentId: CreditDocumentId.toString()
        }
    })
        .then(response => response.json())
        .then(result => {
        $("#TabSalesDetailT > tbody").empty();
        var cont = 0;
        var total = 0;
        for (var j in result) {
            var amount = result[cont].Amount;
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
            var btn1 = document.createElement("btnDetailSaleDelete");
            btn1.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
            btn1.classList.add("btnGridDelete");
            btn1.setAttribute('onclick', 'fnSalesDetailDelete(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')');
            var btn2 = document.createElement("btnDetailSaleUpdate");
            btn2.innerHTML = '<i class="fa-solid fa-pencil"></i>';
            btn2.classList.add("btnGridUpdate");
            btn2.setAttribute('onclick', 'fnSalesDetailUpdate(' + CreditDocumentId + ',' + result[cont].ItemsCreditDocumentsId + ')');
            var newCell = document.createElement("td");
            newCell.appendChild(btn1);
            newCell.appendChild(btn2);
            newRow.append(newCell);
            $("#rowsSalesDetail").append(newRow);
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
function fnSalesDetailDelete(carNum, carItem) {
    Swal.fire({
        icon: 'warning',
        title: 'Desea borrar el registro id:' + carItem + ' del carrito id:' + carNum + ' definitivamente?',
        text: 'Confirme su solicitud.',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'S�, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            let url = ApiBackEndUrl + 'ItemsCreditDocuments/deleteItemsCreditDocuments';
            let response = fetch(url, {
                method: 'DELETE',
                headers: {
                    id: carItem.toString()
                }
            })
                .then(response => response.json())
                .then(result => {
                if (result == true) {
                    fnLoadSalesDetail(carNum);
                    Swal.fire('Borrado!', 'Registro borrado satisfactoriamente.', 'success');
                }
                else {
                    Swal.fire('Se detecto un error!', 'el archivo no pudo ser borrado.', 'error');
                }
            })
                .catch(error => {
                Swal.fire('Se detecto un error!', 'Error en la solicitud al sitio remoto (API).', 'error');
            });
        }
    });
}
function fnSalesDetailUpdate(carNum, carItem) {
    $('#lblSalesDetailId').html(carItem.toString());
    fnAddSalesDetail();
    fnLoadSelect('SelectSaleDeailProduct', 'Products/GetProducts');
    fnLoadSelect('SelectSaleDeailFrom', 'Destinations/GetDestinations');
    fnLoadSelect('SelectSaleDeailTo', 'Destinations/GetDestinations');
    let url = ApiBackEndUrl + 'ItemsCreditDocuments/GetItemsCreditDocumentsById';
    let response = fetch(url, {
        method: 'GET',
        headers: {
            id: carItem.toString()
        }
    })
        .then(response => response.json())
        .then(result => {
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
    var isUpdate = (SaleDetailId_ == "" ? false : true);
    if (Product_ == "" || Product_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el producto'
        });
        return;
    }
    else if (From_ == "" || From_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el origen'
        });
        return;
    }
    else if (To_ == "" || To_ == null) {
        Swal.fire({
            icon: 'warning',
            title: 'Complete todos los campos',
            text: 'No puede estar vacio el destino'
        });
        return;
    }
    else if (Amount_ == "" || Amount_ == null) {
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
        console.log(JSON.stringify(data[0]));
        let url = ApiBackEndUrl + 'ItemsCreditDocuments/insertItemsCreditDocuments';
        let response = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                mode: 'no-cors'
            },
            body: JSON.stringify(data[0])
        })
            .then(response => response.json())
            .then(result => {
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
        let response = fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                mode: 'no-cors'
            },
            body: JSON.stringify(data[0])
        })
            .then(response => response.json())
            .then(result => {
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
