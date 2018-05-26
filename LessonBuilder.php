<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 20. 5. 2018
 * Time: 10:33
 */

include 'Lesson.php';

class LessonBuilder
{
    private $rowspan;

    private $name;

    private $classRoom;

    private $teacher;

    private $group;

    private $substituted;

    private $inBuild = false;



    public function resetValues()
    {
        $this->rowspan      = null;
        $this->name         = null;
        $this->classRoom    = null;
        $this->teacher      = null;
        $this->group        = null;
        $this->inBuild      = false;
    }

    public function saveLesson()
    {
        $lesson = null;
        if(
            $this->rowspan
            && $this->name
            && $this->classRoom
            && $this->teacher
        )
            $lesson = new Lesson($this->rowspan, $this->name, $this->classRoom, $this->teacher, $this->group, $this->substituted);
        $this->resetValues();
        return $lesson;
    }

    public function setRowspan($in)
    {
        $this->rowspan = $in;
        $this->inBuild = true;
        return $this;
    }

    public function setName($in)
    {
        $this->name = $in;
        $this->inBuild = true;
        return $this;
    }

    public function setClassRoom($in)
    {
        $this->classRoom = $in;
        $this->inBuild = true;
        return $this;
    }

    public function setTeacher($in)
    {
        $this->teacher = $in;
        $this->inBuild = true;
        return $this;
    }

    public function setGroup($in)
    {
        $this->group = $in;
        $this->inBuild = true;
        return $this;
    }

    public function setSubstitution($in)
    {
        $this->substituted = $in;
        $this->inBuild = true;
        return $this;
    }
}