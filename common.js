function $(id) {
    return document.getElementById(id);
}

function GETRequest(url) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.send(null);

    return xhr;
}

function POSTRequest(url, data) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);

    var type = 'application/x-www-form-urlencoded';
    xhr.setRequestHeader('Content-Type', type);

    data = 'data=' + encodeURIComponent(data);
    xhr.send(data);

    return xhr;
}

function Resource(name) {
    this.name = name;

    this.reload = function(name) {
        var url = '/' + name + '.html';
        var res = GETRequest(url);
        var div = document.createElement('div');

        res.onload = function() {
            div.className = name;
            div.innerHTML = this.responseText;

            var page = document.getElementById('page');
            console.assert( $('page') === page, '$ is not work!' );
            page.innerHTML = div.outerHTML;
        }
    }

    this.reload(name);
}

var cur = {};

cur.user = {
    name: '',
    pass: ''
};

cur.jewel = [
'green', 'red', 'purple', 'white', 'blue', 'azure',
    ];

// загружаем главную страницу
window.onload = function() {
    loadLogin();
}

function loadLogin() {
    cur.resource = new Resource('login');
}

function loginParse() {
    var user = cur.user;

    user.name = $('login_name').value;
    user.pass = $('login_pass').value;
    var data = user.name + '::' + user.pass;

    console.time('get auth');
    var xhr = POSTRequest('/auth.php', data);

    xhr.onload = function() {
       console.log(this);
       if (this.responseText != 'good') {
           $('login_name').value =
               $('login_pass').value =
               user.name = user.pass = '';
       } else {
           cur.resource = new Resource('storage');
       }
       console.timeEnd('get auth');
    }

    console.log(user);
}

function loadTransaction() {
    var div = document.createElement('div');
    div.className = 'transaction';

    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'flow';

    radio.setAttribute('value', 'income');
    radio.setAttribute('checked', '');
    div.innerHTML = div.innerHTML + '<label>' +
        radio.outerHTML + 'Ввод' + '</label>';

    radio.setAttribute('value', 'outcome');
    radio.removeAttribute('checked');
    div.innerHTML = div.innerHTML + '<label>' +
        radio.outerHTML + 'Вывод' + '</label><br />';

    var jewel = cur.jewel;
    for (var num in jewel) {
        var stone = jewel[num];

        var label = document.createElement('label');
        label.htmlFor = stone;
        label.innerHTML = stone;

        var input = document.createElement('input');
        input.type = 'text';
        input.id = stone;
        input.setAttribute('value', '');

        div.innerHTML = div.innerHTML +
            label.outerHTML + input.outerHTML + '<br />';
    }

    var button = document.createElement('button');
    button.id = 'make_transac';
    button.innerHTML = 'Оформить';

    var page = $('page');
    div.innerHTML = div.innerHTML + button.outerHTML;
    page.innerHTML = div.outerHTML;
    cur.resource.name = 'transaction';

    $('make_transac').onclick = function() {
        makeTransaction();
    }
}

function collectTransaction() {
    var flow = document.getElementsByName('flow');

    cur.transaction = {};

    for(var i in flow) {
        if (flow[i].checked === true) {
            cur.transaction.status = flow[i].value;
            break;
        }
    }

    var jewel = cur.jewel;
    for (var num in jewel) {
        var stone = jewel[num];
        var value = parseInt( $(stone).value );

        if (value) {
            cur.transaction[stone] = value;
        } else {
            cur.transaction[stone] = 0;
        }
    }
    console.log(cur);

    // сформировать страницу подтверждения
}

function makeTransaction() {
    collectTransaction();
    var jewel = cur.jewel;
    var data = cur.transaction;

    var div = document.createElement('div');
    div.className = 'confirm';

    var head = 'Оформление заявки на ';
    if (data.status == 'income') {
        head += 'ввод';
    } else {
        head += 'вывод';
    }
    head += ':<br />';

    var body = '';
    for (var num in jewel) {
        var stone = jewel[num];

        if (data[stone] == 0) continue;
        body += stone + ': <b>' + data[stone] + '</b><br />';
    }

    var button = document.createElement('button');

    button.id = 'confirm_transac';
    button.innerHTML = 'Отправить';
    div.innerHTML = head + body + button.outerHTML;

    button.id = 'load_transac';
    button.innerHTML = 'Отменить';
    div.innerHTML = div.innerHTML + button.outerHTML;

    $('page').innerHTML = div.outerHTML;
    cur.resource.name = 'confirm';

    $('confirm_transac').onclick = function() {
        confirmTransaction();
    };
    $('load_transac').onclick = function() {
        loadTransaction();
    };
}

function confirmTransaction() {
}

