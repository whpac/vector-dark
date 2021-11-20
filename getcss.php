<?php
header('Content-Type:text/css');

$default_css = 'vector.css';
$additional_css = [
    'popups' => 'popups.css',
    'user_colors' => 'user_colors.css',
    'talk_colors' => 'talk_colors.css',
    'sandbox' => 'sandbox.css',
    'commons' => 'commons.css',
    'plwikinews' => 'plwikinews.css',
    'wikidata' => 'wikidata.css'
];

if(isset($_GET['f'])) $file_id = $_GET['f'];
else $file_id = '';

$file = $default_css;
if(isset($additional_css[$file_id])) $file = $additional_css[$file_id];

if(isset($_COOKIE['vectorDark_enable']) && !isset($_GET['force_css'])){
    if($_COOKIE['vectorDark_enable'] == '0'){
        outputFile('css/light/'.$file);
        return;
    }
}

outputFile('css/dark/'.$file);

function outputFile($file){
    $file_etag = calculateETag($file);
    if(checkETag($file_etag)){
        logData('304: '.$_SERVER['HTTP_USER_AGENT']."\n");
        header($_SERVER['SERVER_PROTOCOL'].' 304 Not Modified');
        header('ETag: "'.$file_etag.'"');
        header('Cache-Control: no-cache, private');
        header('Vary: Cookie');
        return;
    }

    logData('200: '.$_SERVER['HTTP_USER_AGENT']."\n");
    header('ETag: "'.$file_etag.'"');
    header('Cache-Control: no-cache, private');
    header('Vary: Cookie');
    echo(file_get_contents($file));
}

// false - need to send CSS, true - use cache
function checkETag($file_etag){
    if(!isset($_SERVER['HTTP_IF_NONE_MATCH'])) return false;
    $if_none_match = $_SERVER['HTTP_IF_NONE_MATCH'];
    $request_etags = explode(',', $if_none_match);
    foreach($request_etags as $request_etag){
        $request_etag = str_replace('W/', '', $request_etag);
        $request_etag = trim($request_etag, ' "');
        if($request_etag == $file_etag) return true;
    }
    return false;
}

function calculateETag($file){
    return md5_file($file);
}

function logData($data){
    file_put_contents('../vd.txt', '['.time().']'.$data, FILE_APPEND);
}
?>