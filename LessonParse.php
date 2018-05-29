<?php
/**
 * Created by PhpStorm.
 * User: Kryštof
 * Date: 20. 5. 2018
 * Time: 10:03
 */

include 'LessonBuilder.php';


/**
 * Parses single node to Lesson instance
 * @param DOMNode $HTMLnode
 * @return Lesson|null
 */
function LessonParse($HTMLnode)
{
    $data       = $HTMLnode->childNodes;
    $builder    = new LessonBuilder();

    $builder->setName($data[0]->textContent);
    $builder->setRowspan($HTMLnode->attributes[0] ? intval($HTMLnode->attributes[0]->value) : 1);

    foreach ($data as $info)
    {
        if($info->attributes[0])
        {
            if(preg_match_all('/teacher/', $info->attributes[0]->value))
                $builder->setTeacher($info->textContent);

            elseif (preg_match_all('/room/', $info->attributes[0]->value))
                $builder->setClassRoom($info->textContent);
        }
    }

    return $builder->saveLesson();
}