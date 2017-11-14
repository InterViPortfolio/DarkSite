function showSkype() {
    if (device.mobile()) {
        prompt(document.getElementById('skype-title').innerHTML, document.getElementById('skype-text').getAttribute('value'));
        return;
    }
    $('#skype-box').show();
    $('#skype-box').animate({
        width: '+=200px',
        height: '+=125px',
        opacity: '+=1'
    }, 'slow');
}

function closeSkype() {
    $('#skype-box').animate({
        width: '-=200px',
        height: '-=125px',
        opacity: '-=1',
        display: 'none'
    }, 'slow', function() {$('#skype-box').hide();});
}

function toTop() {
    $('html, body').stop().animate({scrollTop: 0}, 200);
}

var ulvis = false;
window.onscroll = function() {
    if (device.mobile()) return;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var uplink = $('#uplink');
    if (y > 30 && !ulvis) {
        uplink.show();
        uplink.stop().animate({opacity: '+=1'}, 'slow');
        ulvis = true;
    } else if (y <= 30 && ulvis) {
        uplink.stop().animate({opacity: '-=1'}, 'slow', function() {uplink.hide()});
        ulvis = false;
    }
}

function editComment(button) {
    var but = $(button);
    var e = but.parent().parent().parent().children('.comtext');
    if (but.val() === 'Готово') {
        e.replaceWith('<div class=\'comtext\'>' + e.val() + '</div>');
        but.val('Редактировать');
        Prism.highlightAll(true);
    } else {
        e.replaceWith('<textarea class=\'comtext edarea\'>' + e.html() + '</textarea>');
        but.val('Готово');
    }
}

function delComment(button) {
    $(button).parent().children('.del-confirm').show();
}

function cdelComment(link) {
    $(link).parent().parent().parent().parent().remove();
}

function noDelComment(link) {
    $(link).parent().hide();
}

function passChange() {
    $('#upass2').parent().children('.errtext').remove();
    if (!$('#upass1').val() || !$('#upass2').val() || $('#upass1').val() != $('#upass2').val())
        $('#upass2').parent().append('<p class=\'errtext ierr\'>Пароли пусты или не совпадают!</p>');
}

function emailChange() {
    $('#uemail').parent().children('.errtext').remove();
    var re = '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';
    if (!$('#uemail').val() || !$('#uemail').val().match(re))
        $('#uemail').parent().append('<p class=\'errtext ierr\'>Не корректный email!</p>');
}

function nickChange() {
    $('#uname').parent().children('.errtext').remove();
    if (!$('#uname').val() || !$('#uname').val().match('^[a-zA-Z0-9-_]+$'))
        $('#uname').parent().append('<p class=\'errtext ierr\'>Не корректный ник!</p>');
}
