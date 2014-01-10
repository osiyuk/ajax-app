<?php
// библиотека отладки интерфейсов

function dump($var, $lvl = 0)
{
    $dump = "";
    if(is_array($var)) $Type = "Array[".count($var)."]";
    else if(is_object($var)) $Type = "Object";
    else $dump .= '"'.HtmlSpecialChars($var).'"'."\n";

    // печатаем содержимое массива или объекта
    if (@$Type) {
        $dump .= "$Type\n";
        for (reset($var), $lvl++; list($k,$v) = each($var);) {
            if(is_array($v) && $k==="GLOBALS") continue;
            for($i=0; $i<$lvl; $i++) $dump .= "\t";
            $dump .= "<b>".HtmlSpecialChars($k)."</b> => ".
            dump($v, $lvl);
        }
    }
    return $dump;
}

