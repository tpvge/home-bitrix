
; /* Start:"a:4:{s:4:"full";s:74:"/bitrix/components/local/comp1/templates/.default/script.js?16985850601881";s:6:"source";s:59:"/bitrix/components/local/comp1/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function notPossibleToWriteReview(errorsBlock, errorMessage) {
  BX("review_form").remove();
  errorsBlock.classList.remove("d-none");
  errorsBlock.innerHTML = errorMessage;
}

function reviewActions(arResult) {
  BX("review_loading").remove();

  let reviewText = BX("review_text");
  console.log(reviewText);
  let saveButton = BX("save");
  let errorsBlock = BX("errors_output");

  if (arResult.USER_AUTHORIZED == "N") {
    notPossibleToWriteReview(errorsBlock, 'Только авторизованные пользователи могут оставлять отзывы')
    return;
  }

  if (arResult.VOTING_BANNED == "1") {
    notPossibleToWriteReview(errorsBlock, 'Вам запрещено оставлять отзывы, свяжитесь с администрацией сайта.');
    return;
  }

  BX("review_form").classList.remove("d-none");

  saveButton.addEventListener("click", async function () {
    errorsBlock.classList.add("d-none");
    let starsInput = document.querySelector("input[name='rating']:checked");
    console.log(starsInput.value);
    const response = await fetch(
      "/bitrix/components/local/comp1/ajax.php",
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        method: "POST",
        body: JSON.stringify({
          elementId: saveButton.dataset.element,
          text: reviewText.value.trim(),
          stars: starsInput.value,
        }),
      }
    ).then((res) => res.json());

    if (response.status === "ok") {
      errorsBlock.classList.add("d-none");
      const textSpan = document.createElement("span");
      textSpan.innerHTML = reviewText.value;
      reviewText.replaceWith(textSpan);
      saveButton.disabled = true;
    } else {
      errorsBlock.classList.remove("d-none");
      errorsBlock.innerHTML = response.errors.join(" ");
    }
  });
}

/* End */
;; /* /bitrix/components/local/comp1/templates/.default/script.js?16985850601881*/
