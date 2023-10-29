<?php

namespace Orm\Review;

require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Event;
use Bitrix\Main\EventResult;



switch ($_SERVER["REQUEST_METHOD"]) {
    case 'POST':
        $post = json_decode(file_get_contents('php://input'), true);
        //file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/add_message.log", print_r($post, 1) . ";\n", FILE_APPEND);
        addReview($post);
        break;
    default:
        require_once $_SERVER["DOCUMENT_ROOT"] . "/404.php";
}

function addReview($postData): void
{
    global $USER;
    $errors = [];

    $elementId = (int)$postData['elementId'];
    $stars = $postData['stars'];
    $text = $postData['text'];

    if ($USER->GetID() == 0) {
        $errors[] = 'Отзывы могут оставлять только авторизованные пользователи';
    }

    if (empty($stars)) {
        $errors[] = 'Отзыв должен быть с оценкой.';
    }

    if (empty($text)) {
        $errors[] = 'Напишите текст отзыва.';
    }

    $event = new Event('elementVoting', 'BeforeComponentUserVote', [
        'ELEMENT_ID' => $elementId
    ]);

    $event->send();
    if ($event->getResults()) {
        foreach ($event->getResults() as $eventResult) {
            if ($eventResult->getType() != EventResult::SUCCESS) {
                $arParameters = $eventResult->getParameters();
                $errors[] = $arParameters['error'];
            }
        }
    }

    if ($errors) {
        http_response_code(400);
        echo json_encode(["errors" => $errors], JSON_UNESCAPED_UNICODE);
        return;
    }
    $result = RatingEntityTable::add([
        'USER_ID' => (int)$USER->GetID(),
        'ELEMENT_ID' => $elementId,
        'VALUE' => $stars,
        'TEXT' => $text
    ]);

    if (!$result->isSuccess()) {
        echo json_encode($result->getErrors(), JSON_UNESCAPED_UNICODE);
    }

    echo json_encode(["status" => "ok"]);
}
// [{"message":"Значение поля \"TEXT\" недостаточно длинное. Минимальная длина: 1000.","code":"BX_INVALID_VALUE","customData":null},
// {"message":"Неправильный формат \"DATE_TIME\"","code":"BX_INVALID_VALUE","customData":null}]{"status":"ok"}