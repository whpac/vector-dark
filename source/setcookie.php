<?php
// GET: is_on=true => vectorDark_enable = 1 [DEFAULT]
// GET: is_on=false => vectorDark_enable = 0
if(!isset($_GET['is_on'])) return;

$value = '1';
if($_GET['is_on'] == 'false') $value = '0';

header('Set-Cookie: vectorDark_enable='.$value.'; SameSite=None; Secure');

?>