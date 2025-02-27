class PasswordGenerator {
    constructor(length = 12, strength = "normal", userInfo = {}) {
        this.length = length;
        this.strength = strength;
        this.userInfo = userInfo;
    
        // Character sets
        this.specialChars = "!@#$%^&*";
        this.numbers = "0123456789";
    }

    generate() {
        let passwordComponents = [];

        // Add user details in a structured way
        if (this.userInfo.firstName) passwordComponents.push(this.userInfo.firstName.slice(0, 3));
        if (this.userInfo.lastName) passwordComponents.push(this.userInfo.lastName.slice(0, 3));
        if (this.userInfo.birthDate) {
            let dateParts = this.userInfo.birthDate.split("-");
            passwordComponents.push(dateParts[0]); // Birth Year (YYYY)
            passwordComponents.push(dateParts[1] + dateParts[2]); // Birth Month & Day (MMDD)
        }
        if (this.userInfo.luckyNumber) passwordComponents.push(this.userInfo.luckyNumber);

        // Add random numbers & symbols based on strength
        if (this.strength === "normal") {
            passwordComponents.push(this.getRandomNumbers(1));
            passwordComponents.push(this.getRandomSpecialChars(1));
        } else if (this.strength === "medium") {
            passwordComponents.push(this.getRandomNumbers(2));
            passwordComponents.push(this.getRandomSpecialChars(2));
        } else if (this.strength === "strong") {
            passwordComponents.push(this.getRandomNumbers(3));
            passwordComponents.push(this.getRandomSpecialChars(3));
        }

        // Shuffle the password to make it look natural
        passwordComponents = this.shuffleArray(passwordComponents);

        // Trim or extend password to match selected length
        return this.adjustPasswordLength(passwordComponents);
    }

    getRandomNumbers(count) {
        return Array.from({ length: count }, () => this.numbers[Math.floor(Math.random() * this.numbers.length)]).join("");
    }

    getRandomSpecialChars(count) {
        return Array.from({ length: count }, () => this.specialChars[Math.floor(Math.random() * this.specialChars.length)]).join("");
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    adjustPasswordLength(passwordArray) {
        let finalPassword = passwordArray.join("");
        if (finalPassword.length > this.length) {
            return finalPassword.slice(0, this.length);
        }
        while (finalPassword.length < this.length) {
            finalPassword += this.getRandomNumbers(1); // Add more numbers if password is too short
        }
        return finalPassword;
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById("passwordLength").value, 10);
    const errorMessage = document.getElementById("errorMessage");
    const inputError = document.getElementById("inputError");
    const passwordDisplay = document.getElementById("passwordDisplay");

    // Get user details
    const userInfo = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        birthDate: document.getElementById("birthDate").value,
        luckyNumber: document.getElementById("luckyNumber").value.trim()
    };

    // Check if required fields are empty
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.birthDate || !userInfo.luckyNumber) {
        inputError.textContent = "⚠️ Please fill in all required fields!";
        inputError.style.display = "block";
        return;
    } else {
        inputError.style.display = "none";
    }

    
    // Validate length
    if (isNaN(length) || length < 6 || length > 15) {
        errorMessage.style.display = "block";
        return;
    } else {
        errorMessage.style.display = "none";
    }

    const selectedStrength = document.querySelector('input[name="strength"]:checked').value;
    const passwordGen = new PasswordGenerator(length, selectedStrength, userInfo);
    const newPassword = passwordGen.generate();

    passwordDisplay.value = newPassword;
}

function copyPassword() {
    const passwordDisplay = document.getElementById("passwordDisplay");
    const message = document.getElementById("message");

    if (!passwordDisplay.value) {
        message.textContent = "⚠️ Generate a password first!";
        message.style.color = "red";
        message.style.display = "block";
        setTimeout(() => {
            message.style.display = "none";
        }, 2000);
        return;
    }

    navigator.clipboard.writeText(passwordDisplay.value);
    message.textContent = "✅ Password copied successfully!";
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 2000);
}

document.getElementById("generateBtn").addEventListener("click", generatePassword);
document.getElementById("copyBtn").addEventListener("click", copyPassword);

document.getElementById("luckyNumber").addEventListener("input", function () {
    const luckyNumber = document.getElementById("luckyNumber");
    const luckyNumberError = document.getElementById("luckyNumberError");

    if (luckyNumber.value < 0) {
        luckyNumberError.textContent = "⚠️ Lucky number cannot be negative!";
        luckyNumberError.style.display = "block";
        luckyNumber.value = ""; // Clear input if negative number is entered
    } else {
        luckyNumberError.style.display = "none";
    }
});


document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#birthDate", {
        dateFormat: "d-m-Y", // Updated format to DD-MM-YYYY
        maxDate: "today", // Prevents selecting future dates
        onChange: function (selectedDates) {
            const birthDateError = document.getElementById("birthDateError");
            if (selectedDates.length > 0 && selectedDates[0] > new Date()) {
                birthDateError.textContent = "⚠️ Birth date cannot be in the future!";
                birthDateError.style.display = "block";
                document.getElementById("birthDate").value = "";
            } else {
                birthDateError.style.display = "none";
            }
        }
    });
});

