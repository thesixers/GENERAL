
const orderForm = document.getElementById("orderForm");

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //  /Fetching Error Divs
  const cust_fNameErr = document.querySelector(".cust_fNameErr");
  const custPhone_noErr = document.querySelector(".custPhone_noErr");
  const cust_emailErr = document.querySelector(".cust_emailErr");
  const cust_addressErr = document.querySelector(".cust_addressErr");
  const food_quantityErr = document.querySelector(".food_quantityErr");

  // //Resetting Regex
  cust_fNameErr.innerHTML = "";
  custPhone_noErr.innerHTML = "";
  cust_emailErr.innerHTML = "";
  cust_addressErr.innerHTML = "";
  food_quantityErr.innerHTML = "";

  //Getting Input Values
  const cust_fName = orderForm.cust_fName.value;
  const custPhone_no = orderForm.custPhone_no.value;
  const cust_email = orderForm.cust_email.value;
  const cust_address = orderForm.cust_address.value;
  const food_quantity = orderForm.food_quantity.value;
  const food_id = orderForm.food_id.value;

  // Regex for the Inputs
  const cust_fNameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  const custPhone_noReg = /^[0-9]+$/;
  const cust_emailReg = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
  const cust_addressReg = /^[a-zA-Z0-9\s,.'-]{3,100}$/;
  const food_quantityReg = /^[0-9]+$/;

  // If Statements
  if (!cust_fNameReg.test(cust_fName)) {
    cust_fNameErr.innerHTML = "Enter a valid Full name";
    return
  }

  if (!custPhone_noReg.test(custPhone_no)) {
    custPhone_noErr.innerHTML = "Enter a valid Phone no";
    return
  }

  if (!cust_emailReg.test(cust_email)) {
    cust_emailErr.innerHTML = "Enter a valid email address";
    return
  }

  if (!cust_addressReg.test(cust_address)) {
    cust_addressErr.innerHTML = "Enter a correct home address";
    return
  }

  if (!food_quantityReg.test(food_quantity)) {
    food_quantityErr.innerHTML = "Enter quantity of food package";
    return
  }


  const data = {
    food_id,
    cust_fName,
    custPhone_no,
    cust_email,
    cust_address,
    food_quantity
  };

  fetch("/payment/make", {
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
            cust_fName: "Ok",
            message: data.msg,
          });
        });

        setInterval(() => {
          window.location.href = data.authorization_url;
        }, 1000);
      }
      if (data.error) {
        // Invoke the toast component
        $(document).ready(() => {
          iziToast.error({
            cust_fName: "Error",
            message: data.error,
          });
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
