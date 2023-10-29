
; /* Start:"a:4:{s:4:"full";s:74:"/bitrix/components/local/comp1/templates/.default/script.js?16982235652287";s:6:"source";s:59:"/bitrix/components/local/comp1/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function notPossibleToWriteReview(errorsBlock, errorMessage) {
  BX("review_form").remove();
  errorsBlock.classList.remove("d-none");
  errorsBlock.innerHTML = errorMessage;
}

function reviewActions(arResult) {
  BX("review_loading").remove();
  let starsInput = BX("stars");
  let starsDiv = BX("stars_block");
  let reviewText = BX("review_text");
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

  starsInput.addEventListener("change", function () {
    starsInput.value = Math.ceil(starsInput.value);
    starsDiv.innerHTML = "";
    if (Number(starsInput.value) < Number(starsInput.min)) {
      starsInput.value = starsInput.min;
    }
    if (Number(starsInput.value) > Number(starsInput.max)) {
      starsInput.value = starsInput.max;
    }

    for (let i = 0; i < Math.ceil(Number(starsInput.value)); i++) {
      starsDiv.innerHTML += "🌟";
    }
  });

  saveButton.addEventListener("click", async function () {
    errorsBlock.classList.add("d-none");
    const response = await fetch(
      "/local/components/custom/element.voting/ajax.php",
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
;; /* /bitrix/components/local/comp1/templates/.default/script.js?16982235652287*/
