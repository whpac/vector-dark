<?php
header('Content-Type:text/css');

if(isset($_COOKIE['vector-dark_enable']) && !isset($_GET['force_css'])){
    if($_COOKIE['vector-dark_enable'] == '0'){
        outputFile('vector.light.css');
    }
}

outputFile('vector.dark.css');

function outputFile($file){
    $file_etag = calculateETag($file);
    if(checkETag($file_etag)){
        header($_SERVER['SERVER_PROTOCOL'].' 304 Not Modified');
        header('ETag: '.$file_etag);
        return;
    }
    
    header('ETag: '.$file_etag);
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
?>