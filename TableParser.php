<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 21. 5. 2018
 * Time: 21:23
 */

include 'LessonParse.php';

/**
 * Class TableParser
 */
class TableParser
{

    /**
     * @var DOMXPath
     */
    private $xpath;

    private $pageLoaded = false;

    /**
     * TableParser constructor.
     * @param $path
     */
    function __construct($path)
    {
       $this->loadDocument($path);
    }


    /**
     * Loads document with table
     * @param string $path
     * @return bool
     */
    public function loadDocument($path)
    {
        $html = file_get_contents($path);
        if($html !== false){
            $dom                = new DOMDocument();
            $dom->loadHTML(file_get_contents($path));
            $this->xpath        = new DOMXPath($dom);
            $this->pageLoaded   = true;
        }
        else
            $this->pageLoaded   = false;

        return $this->pageLoaded;
    }


    public function getLessons($path = null)
    {
        if($path)
            $this->loadDocument($path);

        if(!$this->pageLoaded)
            $this->pageError();

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


    public function isLoaded()
    {
        return $this->pageLoaded;
    }


    private function pageError()
    {
        throw new Exception('Page has not been loaded');
    }
}