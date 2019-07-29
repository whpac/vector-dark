<?php
if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Allow-Credentials: true');
    return;
}

// GET: is_on=true => vector-dark_enable = 1 [DEFAULT]
// GET: is_on=false => vector-dark_enable = 0
if(!isset($_GET['is_on'])) return;

header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Credentials: true');
setcookie('vector-dark_origin', $_SERVER['HTTP_ORIGIN'], time() + 600);

if($_GET['is_on'] == 'true') setcookie('vector-dark_enable', '1', 0, '/vector-dark');
if($_GET['is_on'] == 'false') setcookie('vector-dark_enable', '0', 0, '/vector-dark');
?>