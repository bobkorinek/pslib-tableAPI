<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 20. 5. 2018
 * Time: 10:33
 */

include 'Lesson.php';

/**
 * Class LessonBuilder
 * Design pattern builder created for building 'Lesson' instances
 */
class LessonBuilder
{
    /**
     * Rowspan height
     * @var int
     */
    private $rowspan;

    /**
     * Name of the lesson
     * @var string
     */
    private $name;

    /**
     * Name of the lesson's classroom
     * @var string
     */
    private $classRoom;

    /**
     * Name of the lesson's teacher
     * @var string
     */
    private $teacher;

    /**
     * Group's identification
     * @var
     */
    private $group;

    /**
     * Lesson's substitution state
     * @var string
     */
    private $substituted;

    /**
     * Build identification
     * @var bool
     */
    private $inBuild = false;


    /**
     * Resets all values in builder
     */
    public function resetValues()
    {
        $this->rowspan      = null;
        $this->name         = null;
        $this->classRoom    = null;
        $this->teacher      = null;
        $this->group        = null;
        $this->inBuild      = false;
    }

    /**
     * Creates instance of Lesson class
     * @return Lesson|null
     */
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

    /**
     * @param int $in
     * @return $this
     */
    public function setRowspan($in)
    {
        $this->rowspan = $in;
        $this->inBuild = true;
        return $this;
    }

    /**
     * @param string $in
     * @return $this
     */
    public function setName($in)
    {
        $this->name = $in;
        $this->inBuild = true;
        return $this;
    }

    /**
     * @param string $in
     * @return $this
     */
    public function setClassRoom($in)
    {
        $this->classRoom = $in;
        $this->inBuild = true;
        return $this;
    }

    /**
     * @param string $in
     * @return $this
     */
    public function setTeacher($in)
    {
        $this->teacher = $in;
        $this->inBuild = true;
        return $this;
    }

    /**
     * @param int $in
     * @return $this
     */
    public function setGroup($in)
    {
        $this->group = $in;
        $this->inBuild = true;
        return $this;
    }

    /**
     * @param string $in
     * @return $this
     */
    public function setSubstitution($in)
    {
        $this->substituted = $in;
        $this->inBuild = true;
        return $this;
    }
}