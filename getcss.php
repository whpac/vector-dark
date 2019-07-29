<?php
header('Content-Type:text/css');

if(isset($_COOKIE['vector-dark_enable'])){
    if($_COOKIE['vector-dark_enable'] == '0') return;
}

echo(file_get_contents('vector.dark.css'));
?>