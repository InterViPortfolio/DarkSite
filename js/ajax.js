var page = $('html').attr('data-page');

if (!isLoaded) {
    isLoaded = true;
    switch(page) {
        case 'index':
            $.ajax({url: '/parts/notes.html', async: true}).done(function(html) {
                $('#middle').html(html);
                $('#jsproblem').remove();
            });
            break;
        case 'article':
            var article = $('main').html();
            $.ajax({url: '/index.html', async: true}).done(function(html) {
                $('body').html(getNode(getNode(html, 'body'), 'div'));
                $('#middle').append(article);
                loadComments();
                Prism.highlightAll(true);
                $('#jsproblem').remove();
            });
            break;
        case 'page':
            var article = $('main').html();
            $.ajax({url: '/index.html', async: true}).done(function(html) {
                $('body').html(getNode(getNode(html, 'body'), 'div'));
                $('#middle').append(article);
                $('#jsproblem').remove();
            });
            break;
    }
}

if (device.mobile() && document.body.clientWidth >= 1050) {
    $.ajax({url: '/css/mobile.css', async: true}).done(function(mcss) {
        $('#head').append('<style id=\'jsmobile\'>' + mcss.substring(mcss.indexOf('{') + 1, mcss.lastIndexOf('}')) + '</style>');
    });
}

function loadComments() {
    $.ajax({url: '/parts/comments.html', async: true}).done(function(html) {
        $('#middle').append(html);
        Prism.highlightAll(true);
        $.ajax({url: '/parts/add-comment.html', async: true}).done(function(html2) {
            $('#middle').append(html2);
        });
    });
}

$(document).ready(function() {
    $('body').on('click', '[href$=\'/article.html\']', function(event) {
        if (device.mobile() || event.ctrlKey || event.shiftKey || event.which == 2) return true;
        else movePage($('.content'), true, $(this).attr('href'), 'main', null, loadComments);
        return false;
    });
    $('body').on('click', '[href$=\'/index.html\']', function(event) {
        if (device.mobile() || event.ctrlKey || event.shiftKey || event.which == 2) return true;
        else movePage($('.content'), true, '/parts/notes.html', null, $(this).attr('href'));
        return false;
    });
    $('body').on('click', '[href$=\'/404.html\']', function(event) {
        if (device.mobile() || event.ctrlKey || event.shiftKey || event.which == 2) return true;
        else movePage($('.content'), true, $(this).attr('href'), 'main');
        return false;
    });
    $('body').on('click', '[href$=\'/reg.html\']', function(event) {
        if (device.mobile() || event.ctrlKey || event.shiftKey || event.which == 2) return true;
        else movePage($('.content'), true, $(this).attr('href'), 'main');
        return false;
    });
    $('body').on('click', '[href$=\'/restore.html\']', function(event) {
        if (device.mobile() || event.ctrlKey || event.shiftKey || event.which == 2) return true;
        else movePage($('.content'), true, $(this).attr('href'), 'main');
        return false;
    });
});

function movePage(e1, hasRight, link, sel, href, fun) {
    var mid = $('#middle');

    function animEnd() {
        e1.remove();
        mid.hide();
        mid.empty();
        $.ajax({url: link, async: true}).done(function(html) {
            if (sel) html = $(getNode(html, 'body')).filter(sel).html();
            mid.append(html);
            mid.show();
            if (hasRight) mid.stop().animate({right: '+=150%'}, 'fast');
            else mid.stop().animate({left: '+=150%'}, 'fast');
            history.pushState(null, null, href ? href : link);
            if (typeof(fun) === 'function') fun();
        });
    }

    $('html, body').stop().animate({scrollTop: 0}, 200);
    if (hasRight) $('#middle').stop().animate({right: '-=150%'}, 'fast', animEnd);
    else $('#middle').stop().animate({left: '-=150%'}, 'fast', animEnd);
}

function getNode(html, node) {
    var tag1 = '<' + node + '>';
    var tag2 = '</' + node + '>';
    if (html.indexOf(tag1) != -1 && html.indexOf(tag2) != -1)
        return html.substring(html.indexOf(tag1) + tag1.length, html.lastIndexOf(tag2)).trim();
    return html;
}

function loginClick() {
    var nick = $('#login').val();
    var pass = $('#login-password').val();
    if (!nick.length || !pass.length) {
        $('#showerr').html('<span class=\'errtext\'>Укажите ник и пароль.</span>');
        return;
    }
    $('#login-block').stop().animate({opacity: '-=1'}, 'slow', function() {
        $('#login-block').remove();
        $.ajax({url: '/parts/profile.html', async: true}).done(function(html) {
            $('#left-side').append(html);
            $('#username').text(nick);
            $('#side-profile').show();
            $('#side-profile').stop().animate({opacity: '+=1'}, 'slow');
        });
    });
}

function addComment() {
    var text = $('#comedit').val();
    var name = $('#username');
    if (!text.length) {
        $('#add-comment .errtext').text('Нельзя добавить пустой комментарий.');
        return;
    }
    if (!name.length) {
        $('#add-comment .errtext').text('Сначала войдите.');
        return;
    }
    name = name.text();
    $.ajax({url: '/parts/single-comment.html', async: true}).done(function(html) {
        html = html.replace('{comtext}', text).replace('{comnick}', name).replace('{comdate}', getStrDate());
        $('#comedit').val(null);
        $('#comments').append(html);
        Prism.highlightAll(true);
    });
}

function getStrDate() {
    var date = new Date();
    var result = (date.getDate() + 1) + '-' + (date.getMonth() + 1) + '-' + (date.getYear() + 1) + ' ';
    result = result + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return result;
}

function exitClick() {
    $('#side-profile').stop().animate({opacity: '-=1'}, 'slow', function() {
        $('#side-profile').remove();
        $.ajax({url: '/parts/login.html', async: true}).done(function(html) {
            $('#left-side').append(html);
            $('#login-block').show();
            $('#login-block').stop().animate({opacity: '+=1'}, 'slow');
        });
    });
}

function rotate(sel, d, tim) {
    if (!$(sel).length) return;
    if (d == 360) d = 1;
    else d++;
    $(sel).css('transform', 'rotate(' + d + 'deg)');
    setTimeout(rotate, tim, sel, d, tim);
}

function register() {
    $('#reg-button').parent().children('.errtext').remove();
    $('.indata').change();
    if ($('.udata .ierr').length) {
        $('#reg-button').parent().append('<p class=\'errtext\'>Сначала устраните ошибки.</p>');
        return;
    } else if (!document.getElementById('rulchbox').checked) {
        $('#reg-button').parent().append('<p class=\'errtext\'>Нужно принять правила.</p>');
        return;
    }
    $('#register').append('<div id=\'shadow\'></div><img id=\'loading\' alt=\'Loading...\' src=\'/images/loading.png\' />');
    setTimeout(rotate, 10, '#loading', 1, 10);
    setTimeout(function() {
        $.ajax({url: '/parts/regdone.html', async: true}).done(function(html) {
            $('#shadow').remove();
            $('#loading').remove();
            $('#register').html(html.replace('{name}', $('#uname').val()));
            if (device.mobile()) $('#register .big-img').attr('src', '/images/cat-mob.jpg');
        });
    }, 4000);
}

function resPass() {
    $('#pass-button').parent().children('.errtext').remove();
    $('.indata').change();
    if ($('.udata .ierr').length) {
        $('#pass-button').parent().append('<p class=\'errtext\'>Сначала устраните ошибки.</p>');
        return;
    }
    $('#pass-restore').append('<div id=\'shadow\'></div><img id=\'loading\' alt=\'Loading...\' src=\'/images/loading.png\' />');
    setTimeout(rotate, 10, '#loading', 1, 10);
    setTimeout(function() {
        $.ajax({url: '/parts/pass.html', async: true}).done(function(html) {
            $('#shadow').remove();
            $('#loading').remove();
            $('#pass-restore').html(html.replace('{name}', $('#uname').val()));
            if (device.mobile()) $('#pass-restore .big-img').attr('src', '/images/dog-mob.jpg');
        });
    }, 4000);
}

function showRules() {
    $.ajax({url: '/parts/rules.html', async: true}).done(function(html) {
        $('#register').append(html);
        if (device.mobile()) $('#rulbox').animate({left: '+=154%'}, 'slow');
        else $('#rulbox').animate({left: '+=200%'}, 'slow', function() {
            //if (device.mobile()) $('#rulbox').animate({left: '-=150px'});
            if (!device.mobile()) $('#rulbox').animate({left: '-=400px'});
        });
    });
}

function closeRules() {
    $('#rulbox').stop().animate({opacity: '-=1'}, 'slow', function() {$('#rulbox').remove();});
}
