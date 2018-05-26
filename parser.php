<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 19. 5. 2018
 * Time: 20:42
 */

//header('Content-Type: application/json');
require_once 'TableParser.php';
require_once 'Substitution.php';

ini_set('display_errors', 0);


if(!isset($_GET['date']))
{
    echo 'No date';
    die();
}
elseif (!isset($_GET['class']))
{
    echo 'No class';
    die();
}

$parser = new TableParser("https://web.pslib.cz/pro-studenty/rozvrh/class:".strtoupper($_GET['class']));
$lessons = $parser->getLessons();

$supl = new Substitution($lessons, $_GET['class']);
$supl->getData($_GET['date']);

//echo json_encode($lessons);