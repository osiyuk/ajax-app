<?php
$server = "mysql.hostinger.ru";
$username = "u939023122_user9";
$password = "user939";
$database = "u939023122_data";

function validate($data)
{
    return $data === mysql_real_escape_string($data);
}

function validateUser($user, $pass)
{
    $sql = "select count(1) from `users` where " .
        "user='$user' and pass='$pass';";

    $res = mysql_query($sql);
    $count = mysql_result($res, 0);
    
    if ($count == 1) return true;
    return false;
}

