<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 26. 5. 2018
 * Time: 11:23
 */

require_once 'Lesson.php';
require_once 'LessonBuilder.php';

class Substitution
{

    private $lessonData;
    private $url;
    private $xpath;
    private $class;
    private $weekDay;

    function __construct($lessonData, $class, $url = 'https://www.pslib.cz/suplovani/')
    {
        $this->lessonData   = $lessonData;
        $this->url          = $url;
        $this->class        = strtoupper($class);
    }


    public function loadPage($date)
    {
        $dom            = new DOMDocument();
        $strDate        = $this->url.'tr'.$this->parseDate($date).'.htm';
        $dom->loadHTML(str_replace("&nbsp;",'',file_get_contents($strDate)));
        $this->xpath    = new DOMXPath($dom);

        switch (date('w', strtotime($date)))
        {
            case 1: $this->weekDay = 'Po'; break;
            case 2: $this->weekDay = 'Út'; break;
            case 3: $this->weekDay = 'St'; break;
            case 4: $this->weekDay = 'Čt'; break;
            case 5: $this->weekDay = 'Pá'; break;
        }

        return $this->xpath;
    }


    public function getData($date = null, $class = null)
    {
        if(isset($date))
            $this->loadPage($date);


        $rows = $this->xpath->query("//table[@class='tb_supltrid_1']/tr");
        $isSub = false;
        $newLessons = $this->lessonData;

        for ($i = 1; $i < sizeof($rows); $i++)
        {
            $row = $rows[$i];
            $pass = false;

            $rowData = $this->parseRow($row);
            if($rowData[0] == $this->class)
            {
                $isSub = true;
                $pass = true;
            }
            else if(!$rowData[0] && $isSub)
            {
                $pass = true;
            }
            else if($rowData[0] && $isSub)
                break;

            if($pass)
            {
                if(sizeof($rowData) == 8)
                {
                    $hour       = intval($rowData[1][0]);
                    $group      = preg_match_all('!\d+!', $rowData[3], $matches) ? intval($matches[0][0]) : 0;
                    $builder    = new LessonBuilder();
                    $builder->setRowspan($newLessons[$this->weekDay][$hour-1][0]->rowspan)
                            ->setName($rowData[2])
                            ->setClassRoom($rowData[4])
                            ->setTeacher($rowData[6])
                            ->setSubstitution($rowData[5]);

                    if($group != 0)
                    {
                        $builder->setGroup($group);
                        $newLessons[$this->weekDay][$hour-1][$group-1] = $builder->saveLesson();
                    }
                    else
                        $newLessons[$this->weekDay][$hour-1][0] = $builder->saveLesson();
                }
            }
        }
        var_dump($newLessons["Pá"]);
    }


    private function parseRow($row)
    {
        $columns = $row->childNodes;
        $data = [];
        foreach($columns as $column)
        {
            if($column->tagName == 'td')
                $data[] = trim($column->nodeValue);
        }
        return $data;
    }


    private function parseDate($str)
    {
        return substr(str_replace('-', '', $str),2);
    }

}