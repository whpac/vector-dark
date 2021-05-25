<?php
// GET: is_on=true => vector-dark_enable = 1 [DEFAULT]
// GET: is_on=false => vector-dark_enable = 0
if(!isset($_GET['is_on'])) return;

$value = '1';
if($_GET['is_on'] == 'false') $value = '0';

header('Set-Cookie: vector-dark_enable='.$value.'; SameSite=None; Secure');

?>