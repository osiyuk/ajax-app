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
            page.innerHTML = div.outerHTML;
        }
    }

    this.reload(name);
}

var user = {
    name: '',
    pass: '',

    validate: function() {
        var url = '/auth.php';
        var hash = this.name + '::' + this.pass;

        console.time('post req');
        var xhr = POSTRequest(url, hash);

        var l_name = select('login_name');
        var l_pass = select('login_pass');
        xhr.onload = function() {
            console.log(this);
            if (this.responseText != 'good') {
                name = '';
                pass = '';
                l_name.value = '';
                l_pass.value = '';
            } else {
                //cur.resource.reload('storage');
                cur.resource = new Resource('storage');
            }
            console.timeEnd('post req');
        }
    }
}

var cur = {};

// загружаем главную страницу
window.onload = function() {
    cur.resource = new Resource('login');
}

// поведение кнопки
function loginParse() {
    var l_name = select('login_name');
    var l_pass = select('login_pass');
    user.name = l_name.value;
    user.pass = l_pass.value;
    user.validate();
}

// избавится от этого костыля
function select(name) {
    return document.getElementById(name);
}

