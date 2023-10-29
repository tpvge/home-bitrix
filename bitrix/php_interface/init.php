<?
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
      }
     
   }
}
