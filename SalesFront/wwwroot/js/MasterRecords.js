ApiBackEndUrl = 'https://mlapp.tecnovoz.com.ar:8092/api/';
//FrontEnd = 'https://mlapp.tecnovoz.com.ar:8090/';

//ApiBackEndUrl = 'https://localhost:44384/api/';
FrontEnd = 'https://localhost:7119/';

var condition = true;

function hideAll() {
    $('.divMaster').hide();
}

/*
//Función para cargar todos los select
function fnLoadSelect(nameControl, url) {
    
    nameControl = '#' + nameControl;
    var selectControl = $(nameControl);

    if (selectControl.length == 0)
        return;

    url = ApiBackEndUrl + url;

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: 0,
                take: 1000
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
                        default:
                    }

                    

                    selectControl.append(option);
                    cont++;
                }

            });
}
*/

//###########################################################
//################### Sección de clientes ###################
//###########################################################

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

    obj.data = data;
    console.log(JSON.stringify(data[0]));

    let url = ApiBackEndUrl + 'Clients/insertClient';

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
                Swal.fire({
                    icon: 'info',
                    title: 'Registro agregado exitosamente!',
                    text: 'Se guardó correctamente el registro'
                });

                var position = fnPositionClient();

                fnCleanClient();
                fnLoadClients(0, position[1]);
            });

}

function fnPositionClient() {
    var numberOfRecords = $('#selDataGroup').html();
    var position = $('#ClientsNPosition').val();

    return [position, numberOfRecords];
}

//function fnCleanClient() {
//    $('#TxtFirstNameCliente').val('');
//    $('#TxtLastNameIdCliente').val('');
//    $('#TxtEmail1Cliente').val('');
//    $('#TxtEmail2Cliente').val('');
//    $('#TxtPhone1Cliente').val('');
//    $('#TxtPhone2Cliente').val('');
//    $('#TxtCommentCliente').val('');
//    $('#TxtDocumCliente').val('');
//    $('#typeDocumentSelect').val('DNI');
//    $('#TxtAdressCliente').val('');
//    $('#TxtNationalitySelect').val('Argentina');
//}

/*
function fnLoadClients(skip, take) {

    //var position = fnPositionClient();
    //var skip = position[0];
    //var take = position[1];

    let url = ApiBackEndUrl + 'Clients/GetClients';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip,
                take: take
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
                    var name_  = result[cont].firstName;
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
                    document.getElementById("rowsClient").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = name_;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = lName_;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = email1;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = email2;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = phone1;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = phone2;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

                    var newCell = document.createElement("td");
                    newCell.innerHTML = tDocument;
                    newRow.append(newCell);
                    document.getElementById("rowsClient").appendChild(newRow); 

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
                    document.getElementById("rowsClient").appendChild(newRow);

                    cont++;
                }

                console.log(result);
            });
}
*/

function fnSelectClient(nameControl) {
    let url = ApiBackEndUrl + 'Clients/GetClients';

    nameControl = '#' + nameControl;
    var selectClients = $(nameControl);

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: 0,
                take: 1000
            }
        })
        .then(
            response => response.json())
        .then(
            result => {
                selectClients.empty();                
                var cont = 0;

                for (var j in result) {
                    //selSellers.append(result[cont].sellerId)

                    var option = $(document.createElement("option"));
                    option.val(result[cont].clientId);
                    option.text(result[cont].firstName + " " + result[cont].lastName);

                    selectClients.append(option);
                    cont++;
                }
            });
}

function fnSalesClient(id, name_, document_) {
    $('#ModalClients_Sales').modal('show');
    $('#idClient_Sales').html(id);
    $('#nameClient_Sales').html(name_);
    $('#documentClient_Sales').html(document_);
}

function fnSearchClient() {
    var position = fnPositionClient();

    fnCleanClient();
    fnLoadClients(position[0], position[1]);
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

//function fnAddClient() {
//    $('#ModalClients').modal('show');
//}

function fnChangeDataGroupClients(num) {
    $('#selDataGroup').html(num);

    var position = fnPositionClient();

    fnCleanClient();
    fnLoadClients(position[0], position[1]);
}

//#############################################################
//################### Sección de vendedores ###################
//#############################################################

//function fnAddSeller() {
//    $('#Modalsellers').modal('show');
//}

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

    obj.data = data;

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

/*
function fnLoadSellers(skip, take) {

    let url = ApiBackEndUrl + 'Sellers/GetSellers';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip,
                take: take
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
                    newCell.innerHTML = result[cont].sellerId;
                    newRow.append(newCell);
                    document.getElementById("rowsSellers").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].firstName;
                    newRow.append(newCell);
                    document.getElementById("rowsSellers").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].lastName;
                    newRow.append(newCell);
                    document.getElementById("rowsSellers").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].email;
                    newRow.append(newCell);
                    document.getElementById("rowsSellers").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].typeDocument;
                    newRow.append(newCell);
                    document.getElementById("rowsSellers").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].documentNumber;
                    newRow.append(newCell);
                    document.getElementById("rowsSellers").appendChild(newRow);

                    cont++;
                }

                console.log(result);
            });
}
*/

function fnSelectSeller(nameControl) {
    let url = ApiBackEndUrl + 'Sellers/GetSellers';

    nameControl = '#' + nameControl;
    var selSellers = $(nameControl);

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: 0,
                take: 1000
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

//#############################################################
//##################### Sección de ventas #####################
//#############################################################

/*
function fnAddSales() {
    $('#ModalSales').modal('show');
}

function fnBtnSaveSale(){
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
        "Id": 0,
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


    obj.data = data;
    console.log(JSON.stringify(data[0]));

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
                    text: 'Se guardó correctamente el registro'
                });
                                
                fnCleanSale();
                fnLoadSale(0, 100);
            });
 }

function fnLoadSales(skip, take) {
    let url = ApiBackEndUrl + 'CreditDocuments/GetCreditDocuments';

    let response = fetch(url,
        {
            method: 'GET',
            headers: {
                skip: skip,
                take: take
            }
        })
        .then(
            response => response.json())
        .then(
            result => {

                $("#TabSales > tbody").empty();
                var cont = 0;

                for (var j in result) {

                    var newRow = document.createElement("tr");
                    
                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].clientsId;
                    newRow.append(newCell);
                    document.getElementById("rowsSales").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].date;
                    newRow.append(newCell);
                    document.getElementById("rowsSales").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].sellersId;
                    newRow.append(newCell);
                    document.getElementById("rowsSales").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].amount;
                    newRow.append(newCell);
                    document.getElementById("rowsSales").appendChild(newRow);

                    var newCell = document.createElement("td");
                    newCell.innerHTML = result[cont].documentNumber;
                    newRow.append(newCell);
                    document.getElementById("rowsSales").appendChild(newRow);

                    cont++;
                }

                console.log(result);
            });
}

function fnCleanSale(){

}
*/

//################################################################
//################### Sección de los gáraficos ###################
//################################################################

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Ventas mensuales por vendedor'
    },
    subtitle: {
        text: 'Análisis de ventas por vendedor'
    },
    xAxis: {
        categories: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Ventas en miles'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Carlos',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]

    }, {
        name: 'Rodrigo',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5,
            106.6, 92.3]

    }, {
        name: 'Luciana',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
            51.2]

    }, {
        name: 'Maria',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8,
            51.1]

    }]
});

//############# Ventas por destinos ################

// Create the chart
Highcharts.chart('container2', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Boletos vendidos por destino, Enero 2022',
        align: 'left'
    },
    subtitle: {
        text: 'Análisis de ventas del mes',
        align: 'left'
    },

    accessibility: {
        announceNewData: {
            enabled: true
        },
        point: {
            valueSuffix: '%'
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [
        {
            name: 'Destinos',
            colorByPoint: true,
            data: [
                {
                    name: 'España',
                    y: 61.04,
                    drilldown: 'España'
                },
                {
                    name: 'Estados_Unidos',
                    y: 9.47,
                    drilldown: 'Estados_Unidos'
                },
                {
                    name: 'Mexico',
                    y: 9.32,
                    drilldown: 'Mexico'
                },
                {
                    name: 'Panamá',
                    y: 8.15,
                    drilldown: 'Panamá'
                },
                {
                    name: 'Brasil',
                    y: 11.02,
                    drilldown: null
                }
            ]
        }
    ],
    drilldown: {
        series: [
            {
                name: 'España',
                id: 'España',
                data: [
                    [
                        'v97.0',
                        36.89
                    ],
                    [
                        'v96.0',
                        18.16
                    ],
                    [
                        'v95.0',
                        0.54
                    ],
                    [
                        'v94.0',
                        0.7
                    ],
                    [
                        'v93.0',
                        0.8
                    ],
                    [
                        'v92.0',
                        0.41
                    ],
                    [
                        'v91.0',
                        0.31
                    ],
                    [
                        'v90.0',
                        0.13
                    ],
                    [
                        'v89.0',
                        0.14
                    ],
                    [
                        'v88.0',
                        0.1
                    ],
                    [
                        'v87.0',
                        0.35
                    ],
                    [
                        'v86.0',
                        0.17
                    ],
                    [
                        'v85.0',
                        0.18
                    ],
                    [
                        'v84.0',
                        0.17
                    ],
                    [
                        'v83.0',
                        0.21
                    ],
                    [
                        'v81.0',
                        0.1
                    ],
                    [
                        'v80.0',
                        0.16
                    ],
                    [
                        'v79.0',
                        0.43
                    ],
                    [
                        'v78.0',
                        0.11
                    ],
                    [
                        'v76.0',
                        0.16
                    ],
                    [
                        'v75.0',
                        0.15
                    ],
                    [
                        'v72.0',
                        0.14
                    ],
                    [
                        'v70.0',
                        0.11
                    ],
                    [
                        'v69.0',
                        0.13
                    ],
                    [
                        'v56.0',
                        0.12
                    ],
                    [
                        'v49.0',
                        0.17
                    ]
                ]
            },
            {
                name: 'Estados_Unidos',
                id: 'Estados_Unidos',
                data: [
                    [
                        'v15.3',
                        0.1
                    ],
                    [
                        'v15.2',
                        2.01
                    ],
                    [
                        'v15.1',
                        2.29
                    ],
                    [
                        'v15.0',
                        0.49
                    ],
                    [
                        'v14.1',
                        2.48
                    ],
                    [
                        'v14.0',
                        0.64
                    ],
                    [
                        'v13.1',
                        1.17
                    ],
                    [
                        'v13.0',
                        0.13
                    ],
                    [
                        'v12.1',
                        0.16
                    ]
                ]
            },
            {
                name: 'Mexico',
                id: 'Mexico',
                data: [
                    [
                        'v97',
                        6.62
                    ],
                    [
                        'v96',
                        2.55
                    ],
                    [
                        'v95',
                        0.15
                    ]
                ]
            },
            {
                name: 'Panamá',
                id: 'Panamá',
                data: [
                    [
                        'v96.0',
                        4.17
                    ],
                    [
                        'v95.0',
                        3.33
                    ],
                    [
                        'v94.0',
                        0.11
                    ],
                    [
                        'v91.0',
                        0.23
                    ],
                    [
                        'v78.0',
                        0.16
                    ],
                    [
                        'v52.0',
                        0.15
                    ]
                ]
            }
        ]
    }
});

