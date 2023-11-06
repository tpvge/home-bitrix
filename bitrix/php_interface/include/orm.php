<?

namespace Orm\Review;
use Bitrix\Main\UserTable;
use Bitrix\Main\Entity;


class RatingEntityTable extends Entity\DataManager
{
    public static function getTableName()
    {
        return 'rating_entity';
    }

    public static function getMap()
    {
        return array(
            new Entity\IntegerField('USER_ID', array(
                'primary' => true,
                'validation' => function () {
                    return array(
                        new Entity\Validator\RegExp('#^[0-9]+$#')
                    );
                }
            )),
            new Entity\ReferenceField(
                'USER',
                '\Bitrix\Main\UserTable',
                ['=this.USER_ID' => 'ref.ID']
            ),

            new Entity\TextField('TEXT', array(
                'validation' => function () {
                    return array(
                        new Entity\Validator\Length(10),
                    );
                },
            )),

            new Entity\FloatField('VALUE', array(
                'validation' => function () {
                    return array(
                        new Entity\Validator\Range(1, 10),
                    );
                },
            )),

            new Entity\IntegerField('ELEMENT_ID', array(
                'primary' => true,
                'validation' => function () {
                    return array(
                        new Entity\Validator\RegExp('#^[0-9]+$#'),
                    );
                },
            )),
            new Entity\ReferenceField(
                'ELEMENT_ID',
                '\Bitrix\Iblock\ElementTable',
                ['=this.ELEMENT_ID' => 'ref.ID']
            ),

            new Entity\DateField('DATE_TIME', array(
                'validation' => function () {
                    return array(
                        new Entity\Validator\RegExp("/^[0-9]{4}.(0[1-9]|1[012]).(0[1-9]|1[0-9]|2[0-9]|3[01])$/"),
                    );
                },
            )),
        );
    }
}

// echo "<pre>";
// var_dump(RatingEntityTable::getEntity()->compileDbTableStructureDump());
// echo "</pre>";
// CREATE TABLE `rating_entity` (
    //`USER_ID` int NOT NULL, 
    // `TEXT` text NOT NULL, 
    // `VALUE` double NOT NULL, 
    // `ELEMENT_ID` int NOT NULL, 
    // `DATE_TIME` datetime NOT NULL, 
    // PRIMARY KEY(`USER_ID`, `ELEMENT_ID`))\
    