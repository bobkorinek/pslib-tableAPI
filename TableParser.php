<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 21. 5. 2018
 * Time: 21:23
 */

include 'LessonParse.php';

class TableParser
{

    private $xpath;

    function __construct($path)
    {
        $this->loadDocument($path);
    }


    public function loadDocument($path)
    {
        $dom            = new DOMDocument();
        $dom->loadHTML(file_get_contents($path));
        $this->xpath    = new DOMXPath($dom);

        return $this->xpath;
    }


    public function getLessons()
    {
        if(!$this->xpath)
            return null;

        $tbody      = $this->xpath->query('//tbody')[0];
        if(!$tbody)
            return null;
        $days       = [];
        $lastDay    = null;
        $firstRow   = false;

        foreach ($tbody->childNodes as $row)
        {
            $lastLesson = 0;
            if($row->childNodes)
            {
                foreach($row->childNodes as $cell)
                {
                    if(!isset($cell->tagName))
                        continue;
                    if($cell->tagName == 'th')
                    {
                        $days[$cell->textContent] = [];
                        $lastDay    = $cell->textContent;
                        $firstRow   = true;
                    }
                    else if($cell->tagName == 'td')
                    {
                        $lesson = LessonParse($cell);
                        if($firstRow)
                            $days[$lastDay][][] = $lesson;
                        elseif($lesson != null)
                            for ($i = $lastLesson; $i < sizeof($days[$lastDay]); $i++)
                            {
                                if($lesson->rowspan == $days[$lastDay][$i][0]->rowspan){
                                    $days[$lastDay][$i][] = $lesson;
                                    $lastLesson = $i+1;
                                    break;
                                }
                            }
                    }
                }
                $firstRow = false;
            }
        }

        return $days;
    }
}