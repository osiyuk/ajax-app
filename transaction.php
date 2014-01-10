<?php
require_once('debug.php');
require_once('database.php');

$data = $_POST['data'];
$obj = json_decode($data, true);

$user = $obj['user'];
$name = $user['name'];
$pass = $user['pass'];

mysql_connect($server, $username, $password);
mysql_select_db($database);

if (validate($name) && validate($pass)) {
    if (validateUser($name, $pass)) {
        $info = $obj['info'];
        $timestamp = $info['timestamp'];
        $storage = $info['storage'];

        $data = json_encode( $obj['transaction'] );
        $sql = "insert into `transactions` "
            ."(timestamp, storage, user, data) "
            ."values ('$timestamp', '$storage', '$name', '$data');";

        if (mysql_query($sql)) {
            echo 'insert complete';
        } else {
            echo mysql_error();
        }
    } else {
        echo 'bad user';
    }
} else {
    echo 'fuck u!';
}

mysql_close();

