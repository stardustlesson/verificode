const storedCode = "1111";
const codeArea = document.getElementById("code");
const codeInputs = document.querySelectorAll("#code input");
const feedback = document.getElementById("feedback");
const feedbackImage = document.getElementById("feedbackImage");
const sendButton = document.getElementById("sendButton");
const buttonReset = document.querySelector('button');
let userCode;


init();

function init() {
    userCode = "";
    codeInputs[0].disabled = false;
    codeInputs[0].focus();
    for (const codeInput of codeInputs) {
        codeInput.value = "";
        codeInput.addEventListener("input", (e) => handleInput(e, codeInput));
    }
}



function handleInput(e, codeInput) {
    const val = e.data || "";
    codeInput.value = val;
    const isValid = val.length == 1 && parseInt(val) >= 0 && parseInt(val) < 10;
    if (!isValid) {
        codeInput.classList.add("error");
        return;
    }
    userCode += parseInt(val);
    codeInput.classList.remove("error");
    codeInput.disabled = true;
    const nextInput = codeInput.nextSibling;
    if (nextInput) {
        nextInput.disabled = false;
        nextInput.focus();
    } else {
        codeInput.blur();
        codeArea.classList.add("shrink");
        evaluate(userCode);
    }
}


async function evaluate(code) {
    const isValid = await serverSideValidation(code);
    isValid ? handleSuccess() : handleError();
}

function handleSuccess() {
    feedbackImage.src = "https://cdn-icons-png.flaticon.com/512/463/463574.png";
    feedbackImage.onload = () => {
        feedbackImage.classList.add("grow");
        feedback.style.height = "180px";
				buttonReset.classList.toggle('hidden');
    };
}


function handleError() {
    feedbackImage.src = "https://cdn-icons-png.flaticon.com/512/463/463612.png";
    feedbackImage.classList.add("grow");
    feedback.style.height = "180px";
    setTimeout(() => {
        sendButton.classList.add("grow");
    }, 300);
}

async function serverSideValidation(code) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = code === storedCode;
    return response;
}


sendButton.addEventListener("click", restoreInputs);

function restoreInputs() {
    userCode = "";
    feedbackImage.classList.remove("grow");
    sendButton.classList.remove("grow");
    for (const codeInput of codeInputs) {
        codeInput.value = "";
    }
    codeArea.classList.remove("shrink");
    codeInputs[0].disabled = false;
    codeInputs[0].focus();
    feedback.style.height = "0px";
}
