<?
require_once('debug.php');
require_once('database.php');

$data = $_POST['data'];

$obj = json_decode($data, true);
//echo dump($obj);

$user = $obj['user'];
$name = $user['name'];
$pass = $user['pass'];

if ( validate($name) && validate($pass) ) {
    if ( validateUser($name, $pass) ) {
        $info = $obj['info'];
        $timestamp = $info['timestamp'];
        $storage = $info['storage'];
        $data = json_encode( $obj['transaction'] );
        echo dump($data);

        $sql = "insert into `transactions` "
            ."(timestamp, storage, user, data) "
            ."values ('$timestamp', '$storage', '$name', '$data');";
        echo dump($sql);

        if ( mysql_query($sql) ) {
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
?>
