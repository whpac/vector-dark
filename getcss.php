<?php
header('Content-Type:text/css');

$default_css = 'vector.css';
$additional_css = [
    'core' => 'vector.css',
    'popups' => 'popups.css',
    'user_colors' => 'user_colors.css',
    'talk_colors' => 'talk_colors.css',
    'sandbox' => 'sandbox.css',
    'commons' => 'commons.css',
    'plwikinews' => 'plwikinews.css',
    'wikidata' => 'wikidata.css',
    'search_replace' => 'search_replace.css'
];

// Decode the list of files to include
if(isset($_GET['f'])) $file_ids = $_GET['f'];
else $file_ids = '';
$file_ids = explode(';', $file_ids);

$files = [];
foreach($file_ids as $file_id){
    if(isset($additional_css[$file_id])) $files[] = $additional_css[$file_id];
}
if(empty($files)) $files[] = $default_css;


if(isset($_COOKIE['vectorDark_enable']) && !isset($_GET['force_css'])){
    if($_COOKIE['vectorDark_enable'] == '0'){
        useFiles('css/light/', $files);
        return;
    }
}

useFiles('css/dark/', $files);

function useFiles($path, $files){
    $etag = calculateETag($path, $files);
    if(checkETag($etag)){
        logData('304: '.$_SERVER['HTTP_USER_AGENT']."\n");
        header($_SERVER['SERVER_PROTOCOL'].' 304 Not Modified');
        header('ETag: "'.$etag.'"');
        header('Cache-Control: no-cache, private');
        header('Vary: Cookie');
        return;
    }

    logData('200: '.$_SERVER['HTTP_USER_AGENT']."\n");
    header('ETag: "'.$etag.'"');
    header('Cache-Control: no-cache, private');
    header('Vary: Cookie');
    outputFiles($path, $files);
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

function calculateETag($path, $files){
    $etag = '';

    foreach($files as $file){
        $etag .= md5_file($path.$file);
    }

    return $etag;
}

function outputFiles($path, $files){
    foreach($files as $file){
        echo(file_get_contents($path.$file));
    }
}

function logData($data){
    // file_put_contents('../vd.txt', '['.time().']'.$data, FILE_APPEND);
}
?>