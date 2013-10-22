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

function button(id, text) {
    var result = document.createElement('button');

    result.id = id;
    result.innerHTML = text;

    return result.outerHTML;
}

function radio(name, value, checked) {
    var result = document.createElement('input');

    result.type = 'radio';
    result.name = name;
    result.setAttribute('value', value);

    if (checked === true)
        result.setAttribute('checked', '');

    return result.outerHTML;
}

function input(type, id, value) {
    var result = document.createElement('input');

    result.type = type;
    result.id = id;
    result.setAttribute('value', value);

    return result;
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
       console.timeEnd('get auth');
       console.log(this);
       if (this.responseText != 'good') {
           $('login_name').value =
               $('login_pass').value =
               user.name = user.pass = '';
       } else {
           cur.resource = new Resource('storage');
       }
    }
}

function loadTransaction() {
    var div = document.createElement('div');
    div.className = 'transaction';

    div.innerHTML = '<label>' + radio('flow', 'income', true) +
        'Ввод' + '</label><label>' + radio('flow', 'outcome') +
        'Вывод' + '</label><br />';

    var jewel = cur.jewel;
    console.time('transaction DOM');
    for (var num in jewel) {
        var stone = jewel[num];

        var gif = document.createElement('div');
        gif.className = stone;

        /*
        var input = document.createElement('input');
        input.type = 'text';
        input.id = stone;
        input.setAttribute('value', '');
        */
        var input = input('text', stone, '');

        var label = document.createElement('label');
        label.appendChild(gif);
        label.appendChild(input);

        div.innerHTML = div.innerHTML + label.outerHTML + '<br />';
    }
    console.timeEnd('transaction DOM');

    var page = $('page');
    div.innerHTML = div.innerHTML + button('make_transac', 'Оформить');
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
        }
    }
    console.log(cur);
}

function makeTransaction() {
    collectTransaction();
    var jewel = cur.jewel;
    var data = cur.transaction;

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

        if (data[stone] === undefined) continue;
        body += stone + ': <b>' + data[stone] + '</b><br />';
    }

    var div = document.createElement('div');
    div.className = 'confirm';
    div.innerHTML = head + body +
        button('confirm_transac', 'Отправить') +
        button('load_transac', 'Отменить');

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
    var info = {
        storage: 'proba',
        timestamp: Math.floor(new Date / 1000)
    };

    data = JSON.stringify( {
        user: cur.user,
        info: info,
        transaction: cur.transaction
    } );

    console.time('send transac');
    var xhr = POSTRequest('/transaction.php', data);

    xhr.onload = function() {
        console.timeEnd('send transac');
        console.log(this);

        switch (xhr.responseText) {
            case 'insert complete':
                loadTransaction();
                break;
            case 'bad user':
            case 'fuck u!':
                loadLogin();
                break;
        }
    }
}

