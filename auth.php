<?
$server = "mysql.hostinger.ru";
$username = "u939023122_user9";
$password = "user939";

mysql_connect($server, $username, $password);

function validate($data) {
    return $data === mysql_real_escape_string($data);
}

$data = $_POST['data'];
list($name, $pass) = explode("::", $data);

if (!validate($name) || !validate($pass)) {
    echo $name . ":" . $pass;
} else {
    $database = "u939023122_data";
    $sql = "select count(1) from `users` where " .
        "user='$name' and pass='$pass';";

    mysql_select_db($database);
    $res = mysql_query($sql);
    $count = mysql_result($res, 0);

    if ($count != 1) {
        echo "fuck!";
    } else {
        echo "good";
    }
}

mysql_close();
?>
