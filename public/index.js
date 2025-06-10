document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const submitButton = document.querySelector(".submit-button");
    const label = document.querySelector("label[for='email']");
    const errorMessage = document.querySelector(".input-error-message");

    const passwordInput = document.getElementById("password");
    const passwordLabel = document.querySelector("label[for='password']");
    const passwordError = document.querySelector(".password-error-message");

    const passwordGroup = passwordInput.closest('.input-group');
    passwordGroup.style.display = "none";
    // 讓密碼欄位背景永遠透明
    passwordInput.style.background = "transparent";
    emailInput.style.background = "transparent";

    let emailPassed = false;

    submitButton.addEventListener("click", function () {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // 無論登入階段都要檢查帳號
        if (emailValue === "") {
            emailInput.classList.add("error");
            label.classList.add("error", "float");
            errorMessage.style.display = "flex";
            errorMessage.querySelector(".error-text").textContent = "電子郵件地址為必填。";
            return;
        } else if (!emailPattern.test(emailValue)) {
            emailInput.classList.add("error");
            label.classList.add("error", "float");
            errorMessage.style.display = "flex";
            errorMessage.querySelector(".error-text").textContent = "電子郵件地址無效。";
            return;
        } else {
            emailInput.classList.remove("error");
            label.classList.remove("error");
            label.classList.add("float");
            errorMessage.style.display = "none";
        }
        if (!emailPassed) {
            emailPassed = true;
            passwordGroup.style.display = "block";
            passwordInput.focus();
            submitButton.textContent = "登入";
            return;
        }
        // ...原本密碼檢查...
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            passwordInput.classList.add("error");
            passwordLabel.classList.add("error", "float");
            passwordError.style.display = "flex";
            passwordError.querySelector(".error-text").textContent = "密碼為必填。";
        } else {
            passwordInput.classList.remove("error");
            passwordLabel.classList.remove("error");
            passwordLabel.classList.add("float");
            passwordError.style.display = "none";
            // 這裡可以進行後續登入流程
            // 傳送資料到 API
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    account: emailValue,
                    password: passwordValue
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.showAll) {
                    // 指定帳密時直接跳轉 all.html
                    window.location.href = "all.html";
                } else if (data.success) {
                    // 登入成功，導向到 success.html
                    window.location.href = "success.html";
                } else {
                    // 登入失敗，顯示錯誤
                    passwordError.style.display = "flex";
                    passwordError.querySelector(".error-text").textContent = data.error || '登入失敗';
                }
            })
            .catch((err) => {
                passwordError.style.display = "flex";
                passwordError.querySelector(".error-text").textContent = '伺服器錯誤';
                console.error(err);
            });
        }
    });

    emailInput.addEventListener("input", function () {
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            label.classList.remove("float");
            errorMessage.style.display = "none";
            emailInput.classList.remove("error");
            label.classList.remove("error");
        } else {
            emailInput.classList.remove("error");
            label.classList.remove("error");
            label.classList.add("float");
            errorMessage.style.display = "none";
        }
        updateLabelColor(emailInput, label);
    });

    passwordInput.addEventListener("input", function () {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            passwordLabel.classList.remove("float");
            passwordError.style.display = "none";
            passwordInput.classList.remove("error");
            passwordLabel.classList.remove("error");
        } else {
            passwordInput.classList.remove("error");
            passwordLabel.classList.remove("error");
            passwordLabel.classList.add("float");
            passwordError.style.display = "none";
        }
        updateLabelColor(passwordInput, passwordLabel);
    });

    emailInput.addEventListener("blur", function () {
        if (!emailInput.classList.contains("error")) {
            label.style.color = "#999";
        }
    });
    emailInput.addEventListener("focus", function () {
        if (!emailInput.classList.contains("error")) {
            label.style.color = "#10a27e";
        }
    });

    passwordInput.addEventListener("blur", function () {
        if (!passwordInput.classList.contains("error")) {
            passwordLabel.style.color = "#999";
        }
    });
    passwordInput.addEventListener("focus", function () {
        if (!passwordInput.classList.contains("error")) {
            passwordLabel.style.color = "#10a27e";
        }
    });

    // 在錯誤狀態時維持紅色，否則根據 focus/blur 切換顏色
    function updateLabelColor(input, label) {
        if (input.classList.contains("error")) {
            label.style.color = "red";
        } else if (document.activeElement === input) {
            label.style.color = "#10a27e";
        } else {
            label.style.color = "#999";
        }
    }

    // 讓 email/password 輸入框在按下 Enter 時也能觸發按鈕
    emailInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            submitButton.click();
        }
    });
    passwordInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            submitButton.click();
        }
    });
});
