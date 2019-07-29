<?php
// GET: is_on=true => vector-dark_enable = 1 [DEFAULT]
// GET: is_on=false => vector-dark_enable = 0
if(!isset($_GET['is_on'])) return;

//header('Access-Control-Allow-Origin: ');
setcookie('vector-dark_origin', $_SERVER['HTTP_ORIGIN'], time() + 600);

if($_GET['is_on'] == 'true') setcookie('vector-dark_enable', '1', 0, '/vector-dark');
if($_GET['is_on'] == 'false') setcookie('vector-dark_enable', '0', 0, '/vector-dark');
?>