//function showDiv(divSelPrincipal) {
//    hideAll();
//    $('#' + divSelPrincipal).show();

//    if (divSelPrincipal == "MasterClients")
//        fnLoadClients(0, 5);
//    if (divSelPrincipal == "MasterSellers")
//        fnLoadSellers(0, 5);
//    if (divSelPrincipal == "MasterSales")
//        fnLoadSales(0, 5);

//    showMenu();
//}

//function showMenu() {
//    if ($("#first-menu").is(":visible")) {
//        $("#first-menu").hide(100);
//    } else {
//        $("#first-menu").show(100);
//    }            
//}

//function fnExpandMenu(n) {
//    if (n == 1) {
//        if ($('#menu-principal-1').is(":visible"))
//            $('#menu-principal-1').hide(100);
//        else {
//            $('#menu-principal-1').show(100);
//            $('#menu-principal-2').hide(100);
//            $('#menu-principal-3').hide(100);
//        }        
//    }
//    else if (n == 2) {
//        if ($('#menu-principal-2').is(":visible"))
//            $('#menu-principal-2').hide(100);
//        else {
//            $('#menu-principal-1').hide(100);
//            $('#menu-principal-2').show(100);
//            $('#menu-principal-3').hide(100);
//        }
//    }
//    else {
//        if ($('#menu-principal-3').is(":visible"))
//            $('#menu-principal-3').hide(100);
//        else {
//            $('#menu-principal-1').hide(100);
//            $('#menu-principal-2').hide(100);
//            $('#menu-principal-3').show(100);
//        }
//    }
//}