<?php
// if(!isRightOrigin()) return;

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Allow-Credentials: true');
    return;
}

// GET: is_on=true => vector-dark_enable = 1 [DEFAULT]
// GET: is_on=false => vector-dark_enable = 0
if(!isset($_GET['is_on'])) return;

header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Credentials: true');

$value = '1';
if($_GET['is_on'] == 'false') $value = '0';
header('Set-Cookie: vector-dark_enable='.$value.'; SameSite=None; Secure');


function isRightOrigin(){
    $domains = ['wikipedia.org', 'wikidata.org'];

    foreach($domains as $domain){
        if(endsWith($_SERVER['HTTP_ORIGIN'], $domain)) return true;
    }
    return false;
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}
?>