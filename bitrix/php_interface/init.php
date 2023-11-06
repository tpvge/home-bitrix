<?

use Bitrix\Iblock\ElementTable;
use Bitrix\Main\Application;
use Bitrix\Main\Config\Option;
use Bitrix\Main\EventResult;
use Bitrix\Main\ORM\EventManager;

if (file_exists($_SERVER["DOCUMENT_ROOT"] . "/bitrix/php_interface/include/orm.php"))
   require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/php_interface/include/orm.php");



RegisterModuleDependences("main", "OnAfterUserRegister", "my_module_id", "MyClass", "OnAfterUserRegisterHandler");

class MyClass
{
   // создаем обработчик события "OnAfterUserRegister"
   public static function OnAfterUserRegisterHandler(&$arFields)
   {
      // если регистрация успешна то
      if ($arFields["USER_ID"] > 0) {
         file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/add_message.log", print_r($arFields, 1) . ";\n", FILE_APPEND);
      }
   }
}

AddEventHandler("sale", "OnSaleComponentOrderOneStepPersonType", "selectSavedPersonType");
function selectSavedPersonType(&$arResult, &$arUserResult, $arParams)
{
   global $USER;

   # если пользователь авторизовн, то посмотрим, сохраннен ли для него тип плательщика
   if ($USER->IsAuthorized()) {
      $rsUser = $USER->GetByID($USER->GetID());
      $arUser = $rsUser->Fetch();

      $arResult['USER_INFO'] = $arUser;
      $arResult['USER_INFO']['USER_TYPE_LIST'] = array(
         '4' => 1, //fiz
         '5' => 2, //ur
         '6' => 3, //ip
      );
      # если задан тип плательщика у пользователя
      if (!empty($arResult['USER_INFO']['UF_PAYER_TYPE']) && isset($arResult['USER_INFO']['USER_TYPE_LIST'][$arResult['USER_INFO']['UF_PAYER_TYPE']])) {
         # снимем активность у выбранного компонетом типа
         $selectedType = 4;
         foreach ($arResult['PERSON_TYPE'] as $key => $type)
            if ($type['CHECKED'] == 'Y')
               $selectedType = $key;

         $arResult['PERSON_TYPE'][$selectedType]['CHECKED'] = '';

         # и запишем наш, чтобы пользователь не смог его поменять   
         $arResult['PERSON_TYPE'][$arResult['USER_INFO']['USER_TYPE_LIST'][$arResult['USER_INFO']['UF_PAYER_TYPE']]]['CHECKED'] = 'Y';
         $arUserResult['PERSON_TYPE_ID'] = $arResult['USER_INFO']['USER_TYPE_LIST'][$arResult['USER_INFO']['UF_PAYER_TYPE']];
      }
   }
}



// регистрируем обработчик
AddEventHandler("main", "OnAfterUserUpdate", "OnAfterUserUpdateHandler");
function OnAfterUserUpdateHandler(&$arFields)
{
   global $USER;

   $name = $arFields["NAME"] . " " . $arFields["LAST_NAME"];
   $rsUser = $USER->GetByID($arFields["ID"]);
   $arUser = $rsUser->Fetch();
   $arr = array(
      '4' => 1, //fiz
      '5' => 2, //ur
      '6' => 3, //ip
   );

   if (!empty($_POST["PERSON_TYPE"]) && $arr[$arUser["UF_PAYER_TYPE"]] != $_POST["PERSON_TYPE"]) {
      $key = array_search($_POST["PERSON_TYPE"], $arr);
      $user = new CUser;
      $fields = array(
         "UF_PAYER_TYPE" => $key,
      );
      $user->Update($arFields["ID"], $fields);
      $dbSales = CSaleOrderUserProps::GetList([], array("USER_ID" => $arFields["ID"]));
      while ($arSales = $dbSales->Fetch()) {
         $personTypeIds[] = $arSales["PERSON_TYPE_ID"];
      }

      if (empty($personTypeIds) || !in_array($_POST["PERSON_TYPE"], $personTypeIds)) {
         $newPerson = [
            "NAME" => $name,
            "USER_ID" => $arFields["ID"],
            "PERSON_TYPE_ID" => $_POST["PERSON_TYPE"]
         ];
         $USER_PROPS_ID = CSaleOrderUserProps::Add($newPerson);


         //OLD PROPS
         $oldSaleOrderProps = CSaleOrderUserProps::GetList(array("DATE_UPDATE" => "DESC"), array("USER_ID" => $USER->GetID(), "PERSON_TYPE_ID" => $arr[$arUser["UF_PAYER_TYPE"]]));
         $arrOldSaleOrderProps = $oldSaleOrderProps->Fetch();
         //получаем текущие значения
         if ($arrOldSaleOrderProps["ID"]) {
            $oldPropVals = CSaleOrderUserPropsValue::GetList(["ID" => "ASC"], array("USER_PROPS_ID" => $arrOldSaleOrderProps["ID"]));
            while ($oldArPropVals = $oldPropVals->Fetch()) {
               $oldUserProfileOrder[$oldArPropVals['PROP_CODE']] = $oldArPropVals;
            }
         }
        
         //NEW PROPS
         $newSaleOrderProps = CSaleOrderUserProps::GetList(array("DATE_UPDATE" => "DESC"), array("USER_ID" => $USER->GetID()));
         $arrNewSaleOrderProps = $newSaleOrderProps->Fetch();
         //получаем текущие значения
         if ($arrNewSaleOrderProps["ID"]) {
            $newPropVals = CSaleOrderUserPropsValue::GetList(["ID" => "ASC"], array("USER_PROPS_ID" => $arrNewSaleOrderProps["ID"]));
            while ($newArPropVals = $newPropVals->Fetch()) {
               $newUserProfileOrder[$newArPropVals['PROP_CODE']] = $newArPropVals;
            }
         }

         //перебираем значения и сравниваем
         foreach ($newUserProfileOrder as $new => $newProfValue) {
            $arField = array();
            $arField = array(
               "USER_PROPS_ID" => $newProfValue["USER_PROPS_ID"],
               "ORDER_PROPS_ID" => $newProfValue["ORDER_PROPS_ID"],
               "NAME" => $newProfValue["NAME"],
            );
            foreach ($oldUserProfileOrder as $old => $oldProfValue) {
               if (($oldProfValue["PROP_IS_LOCATION"] ==  $oldProfValue["PROP_IS_LOCATION"]) && $oldProfValue["PROP_IS_LOCATION"] == "Y") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }

               if (($oldProfValue["PROP_IS_EMAIL"] ==  $oldProfValue["PROP_IS_EMAIL"])  && $oldProfValue["PROP_IS_EMAIL"] == "Y") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }

               if (($oldProfValue["PROP_IS_PROFILE_NAME"] ==  $oldProfValue["PROP_IS_PROFILE_NAME"])  && $oldProfValue["PROP_IS_PROFILE_NAME"] == "Y") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }

               if (($oldProfValue["PROP_IS_PAYER"] ==  $oldProfValue["PROP_IS_PAYER"])  && $oldProfValue["PROP_IS_PAYER"] == "Y") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }

               if (($oldProfValue["PROP_IS_ZIP"] ==  $oldProfValue["PROP_IS_ZIP"])  && $oldProfValue["PROP_IS_ZIP"] == "Y") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }

               if (($old == $new) && $new == "PHONE") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }

               if (($old == $new) && $new == "ADDRESS") {
                  $arField['VALUE'] = $oldProfValue["VALUE"];
                  CSaleOrderUserPropsValue::Update($newProfValue["ID"], $arField);
               }
            }
         }
      }
   }
}


AddEventHandler("sale", "OnSaleComponentOrderJsData", "getUserFields");
function getUserFields(&$arResult)
{
   global $USER;
   $rsUsers = CUser::GetByID($USER->GetID());
   $arUser = $rsUsers->Fetch();
   $arResult['JS_DATA']["USER"]["BONUS"] = $arUser["UF_BONUS"];
   $arResult['JS_DATA']["USER"]["SECOND_NAME"] = $arUser["SECOND_NAME"];
}



//Необходимо проверить, что элемент к которому добавляется отзыв активен,
AddEventHandler("elementVoting", "BeforeComponentUserVote", 'checkElementActivity');
function checkElementActivity($event)
{

   $curDate = new DateTime('now');
   $curDate = $curDate->format('d.m.Y h:i:s');
   CModule::IncludeModule('iblock');
   $result = false;
   $arElement = ElementTable::getList([
      'select' => ['ID', 'ACTIVE_FROM', 'ACTIVE_TO', 'ACTIVE'],
      'filter' => [
         '=ID' => $event,
         '=ACTIVE' => 'Y',
         // [
         //    'LOGIC' => 'OR',
         //    [
         //       '>=ACTIVE_TO' => $curDate,
         //       // '=ACTIVE_TO' => 'NULL',
         //    ]
         // ],
         // [
         //    'LOGIC' => 'OR',
         //    [
         //       '<=ACTIVE_FROM' => $curDate,
         //       // '=ACTIVE_FROM' => 'NULL',
         //    ]
         // ]
      ]
   ])->fetch();
   file_put_contents($_SERVER["DOCUMENT_ROOT"] . '/test.log', json_encode($arElement, JSON_UNESCAPED_UNICODE));
   if ($arElement != false) {
      $result = new EventResult(EventResult::SUCCESS);
   } else {
      $result = new EventResult(EventResult::ERROR, ['error' => 'Добавлять отзывы можно только к активным элементам.']);
   }

   return $result;
}
