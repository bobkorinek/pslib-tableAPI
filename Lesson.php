<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 20. 5. 2018
 * Time: 9:52
 */

class Lesson
{

    public $rowspan;

    public $name;

    public $classRoom;

    public $teacher;

    public $group;

    public $substituted;



    function __construct($rowspan, $name, $classRoom, $teacher, $group = null, $substituted = false)
    {
        $this->rowspan      = $rowspan;
        $this->name         = $name;
        $this->classRoom    = $classRoom;
        $this->teacher      = $teacher;
        $this->group        = $group;
        $this->substituted  = $substituted;
    }
}