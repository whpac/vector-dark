<?php
header('Content-Type:text/css');

if(isset($_COOKIE['vector-dark_enable']) && !isset($_GET['force_css'])){
    if($_COOKIE['vector-dark_enable'] == '0') return;
}

echo(file_get_contents('vector.dark.css'));
?>