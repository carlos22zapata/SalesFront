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