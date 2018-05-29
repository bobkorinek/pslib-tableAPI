<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 19. 5. 2018
 * Time: 20:42
 */

header('Content-Type: application/json');
require_once 'TableParser.php';
require_once 'Substitution.php';

ini_set('display_errors', 0);


$json       = [
    'classExists'   => false,
    'dateExists'    => false,
    'substituted'   => false,
    'lessons'       => []
];


if (!isset($_GET['class']))
{
    echo 'No class';
    die();
}


$parser     = new TableParser("https://web.pslib.cz/pro-studenty/rozvrh/class:".strtoupper($_GET['class']));

if($lessons = $parser->getLessons()){

    $json['classExists']    = true;
    $json['lessons']        = $lessons;

    if(isset($_GET['date']))
    {
        $supl = new Substitution($lessons, $_GET['class']);
        if($supl->loadPage($_GET['date']))
        {
            $json['dateExists'] = true;
            if($supl->containsClass())
            {
                $json['substituted'] = true;
                $json['lessons'] = $supl->getData();
            }
        }
        else
            $json['dateExists'] = false;
    }
}

echo json_encode($json);