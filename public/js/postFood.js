const food_form = document.getElementById("food_form");

food_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = food_form.name.value;
  const img = food_form.img;
  const amount = food_form.amount.value;
  const description = food_form.description.value;

  const nameErr = document.querySelector(".nameErr");
  const imageErr = document.querySelector(".imageErr");
  const amountErr = document.querySelector(".amountErr");
  const descriptionErr = document.querySelector(".descriptionErr");


  const nameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  const amountReg = /^\d+(\.\d{1,2})?$/;
  const descriptionReg = /^[a-zA-Z0-9\s,.'()\-!]+$/;

  nameErr.innerHTML = "";
  amountErr.innerHTML = "";
  descriptionErr.innerHTML = "";
  imageErr.innerHTML = "";
  

  if (!nameReg.test(name)) {
    nameErr.innerHTML = "Invalid food name format";
    return;
  }

  if (!amountReg.test(amount)) {
    amountErr.innerHTML = "Invalid amount format";
    return;
  }

  if (!descriptionReg.test(description)) {
    descriptionErr.innerHTML = "Invalid description input";
    return;
  }

  if (img.files.length == 0) {
    imageErr.innerHTML = "Upload food picture";
    return;
  }


  const formData = new FormData();

  formData.append("name", name);
  formData.append("amount", amount);
  formData.append("description", description);
  formData.append("img", img.files[0]);

  fetch("/post-food", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      //     'Content-Type': 'application/json'
    },
    body: formData,
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
