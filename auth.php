<?php
require_once('database.php');

$data = $_POST['data'];
list($name, $pass) = explode("::", $data);

mysql_connect($server, $username, $password);
mysql_select_db($database);

if (!validate($name) || !validate($pass)) {
    echo $name . ":" . $pass;
} else {
    if (validateUser($name, $pass)) {
        echo "good";
    } else {
        echo "fuck!";
    }
}

mysql_close();

