<?
if($INCLUDE_FROM_CACHE!='Y')return false;
$datecreate = '001698500568';
$dateexpire = '001698504168';
$ser_content = 'a:2:{s:7:"CONTENT";s:1814:"<pre>array(0) {
}
</pre>
<!-- Шаблон компонента element_review -->
<div class="element-review">
            <form id="review-form">
            <input type="hidden" name="ELEMENT_ID" value="">
            <div class="rating-area">
                <input type="radio" id="star-5" name="rating" value="5">
                <label for="star-5" title="Оценка «5»"></label>
                <input type="radio" id="star-4" name="rating" value="4">
                <label for="star-4" title="Оценка «4»"></label>
                <input type="radio" id="star-3" name="rating" value="3">
                <label for="star-3" title="Оценка «3»"></label>
                <input type="radio" id="star-2" name="rating" value="2">
                <label for="star-2" title="Оценка «2»"></label>
                <input type="radio" id="star-1" name="rating" value="1">
                <label for="star-1" title="Оценка «1»"></label>
            </div>
            <textarea name="COMMENT"></textarea>
            <button id="save-button">Сохранить</button>
        </form>
    </div>

<script>
    // AJAX-обработчик для отправки отзыва
    document.getElementById("save-button").addEventListener("click", function() {
        var formData = new FormData(document.getElementById("review-form"));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/bitrix/components/local/addReview/ajax.php");
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            if (response.SUCCESS) {
                location.reload();
            } else {
                alert(response.ERROR);
            }
        };
        xhr.send(formData);
    });
</script>";s:4:"VARS";a:2:{s:8:"arResult";a:0:{}s:18:"templateCachedData";a:3:{s:13:"additionalCSS";s:63:"/bitrix/components/local/addReview/templates/.default/style.css";s:9:"frameMode";N;s:12:"frameModeCtx";s:66:"/bitrix/components/local/addReview/templates/.default/template.php";}}}';
return true;
?>