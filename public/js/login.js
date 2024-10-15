const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // fetching all divs errors
  const phone_noErr = document.querySelector(".phone_noErr");
  const passwordErr = document.querySelector(".passwordErr");

  // resetting the regex
  phone_noErr.innerHTML = "";
  passwordErr.innerHTML = "";

  // getting the input values
  const phone_no = loginForm.phone_no.value;
  const password = loginForm.password.value;

  // regex for input
  const phone_noReg = /^0[1-9]\d{9}$/;
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+\[\]{}|;:,.<>?]).{8,}$/;

  // if statements
  if (!phone_noReg.test(phone_no)) {
    phone_noErr.innerHTML = "Incorrect phone number";
  }

  if (!passwordReg.test(password)) {
    passwordErr.innerHTML = "Incorrect password";
  }

  const data = { phone_no, password };

  fetch("/auth/login", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        $(document).ready(() => {
          iziToast.success({
            title: "Ok",
            message: data.msg,
          });
        });

        setInterval(() => {
          window.location.href = data.redirectURL;
        }, 2000);
      }
      if (data.error) {
        // Invoke the toast component
        $(document).ready(() => {
          iziToast.error({
            title: "Error",
            message: data.error,
          });
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
