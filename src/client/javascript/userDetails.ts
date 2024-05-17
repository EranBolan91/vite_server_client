import { IS_PAYMENT_CREATED, insertPaypalPayment } from "./paypal";
import { changeStep } from "./slider";

const REQUIRED = "This field is required";

const displayMessageRequired = (elementID: string) => {
  const firstNameError = document.getElementById(elementID) as HTMLElement;
  firstNameError.classList.remove("hidden");
  firstNameError.classList.add("block");
};

const removeMessageRequired = (elementID: string) => {
  const firstNameError = document.getElementById(elementID) as HTMLElement;
  firstNameError.classList.remove("block");
  firstNameError.classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", async () => {
  const formContainer = document.getElementById("formContainer");
  formContainer?.insertAdjacentHTML(
    "beforeend",
    `<div
        id="userDetails"
        class="w-full hidden justify-center flex-col items-center">
        <div class="flex w-full items-start">
            <div id="back" class="flex text-black text-sm cursor-pointer">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
                </svg>
                <span>back</span>
            </div>
        </div>
        <div class="w-full flex flex-col justify-center items-center">
            <div style="border-radius:8px;" class="flex badge badge-primary badge-sm md:badge-lg text-sm font-bold p-3 md:p-5 w-56 md:w-96">
              <div class="flex w-full md:w-1/2 justify-evenly">
                <div class="heart">&#x2665;</div>
                <span id="donationTitle"> </span>
              </div>
            </div>
            <h3 class="text-black font-bold text-xl md:text-2xl text-center my-4"> YOUR DETAILS </h3>
            <div class="flex flex-col w-full px-3 md:px-10">
                <input id="firstName" type="text" placeholder="First Name" class="input input-bordered input-sm md:input-md w-full my-2"/>
                <span id="firstNameError" class="text-red-500 italic text-sm hidden"> ${REQUIRED} </span>

                <input id="lastName" type="text" placeholder="Last Name" class="input input-bordered input-sm md:input-md w-full my-2"/>
                <span id="lastNameError" class="text-red-500 italic text-sm hidden"> ${REQUIRED} </span>

                <input id="email" type="email" placeholder="Email" class="input input-bordered input-sm md:input-md w-full my-2"/>
                <span id="emailError" class="text-red-500 italic text-sm hidden"> ${REQUIRED} </span>

                <input type="text" placeholder="Type here" class="input input-bordered input-sm md:input-md w-full my-2"/>

                <button id="nextToPayment" class="btn btn-block btn-sm md:btn-md btn-primary my-3"> Next </button>
            </div>
        </div>
    </div>    
    `
  );

  document.getElementById("back")?.addEventListener("click", () => {
    const userDetails = document.getElementById("userDetails") as HTMLElement;
    userDetails.classList.add("hidden");
    const donateStage = document.getElementById("donateStage") as HTMLElement;
    donateStage.classList.remove("hidden");
    donateStage.classList.add("flex");
    changeStep("0");
  });

  document.getElementById("nextToPayment")?.addEventListener("click", () => {
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    let isInputsFilled = true;

    // if (firstName.value === "") {
    //   displayMessageRequired("firstNameError");
    //   isInputsFilled = false;
    // } else {
    //   removeMessageRequired("firstNameError");
    // }

    // if (lastName.value === "") {
    //   displayMessageRequired("lastNameError");
    //   isInputsFilled = false;
    // } else {
    //   removeMessageRequired("lastNameError");
    // }

    // if (email.value === "") {
    //   displayMessageRequired("emailError");
    //   isInputsFilled = false;
    // } else {
    //   removeMessageRequired("emailError");
    // }

    if (isInputsFilled === true) {
      const userDetails = document.getElementById("userDetails") as HTMLElement;
      userDetails.classList.add("hidden");
      userDetails.classList.remove("flex");

      const paymentContainer = document.getElementById(
        "paymentContainer"
      ) as HTMLElement;
      paymentContainer.classList.remove("hidden");
      paymentContainer.classList.add("flex");

      if (IS_PAYMENT_CREATED === false) {
        insertPaypalPayment();
      }
      changeStep("2");
    }
  });
});
