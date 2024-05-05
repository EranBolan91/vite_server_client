export let IS_PAYMENT_CREATED = false;

export const insertPaypalPayment = () => {
  IS_PAYMENT_CREATED = true;
  window.paypal
    .Buttons({
      style: {
        color: "blue",
        shape: "pill",
        height: 40,
        width: 120,
      },
      async createOrder() {
        try {
          const response = await fetch("/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // use the "body" param to optionally pass additional order information
            // like product ids and quantities
            body: JSON.stringify({
              items: [
                {
                  id: 1,
                  quantity: 2,
                },
                { id: 2, quantity: 3 },
              ],
            }),
          });

          const orderData = await response.json();

          if (orderData.id) {
            return orderData.id;
          } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
              : JSON.stringify(orderData);

            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error(error);
          resultMessage(
            `Could not initiate PayPal Checkout...<br><br>${error}`
          );
        }
      },
      async onApprove(data: any, actions: any) {
        try {
          const response = await fetch(`/api/orders/${data.orderID}/capture`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message

          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(
              `${errorDetail.description} (${orderData.debug_id})`
            );
          } else if (!orderData.purchase_units) {
            throw new Error(JSON.stringify(orderData));
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
              orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
            resultMessage(
              `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`
            );
            console.log(
              "Capture result",
              orderData,
              JSON.stringify(orderData, null, 2)
            );
          }
        } catch (error) {
          console.error(error);
          resultMessage(
            `Sorry, your transaction could not be processed...<br><br>${error}`
          );
        }
      },
    })
    .render("#paypal-button-container");
};

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message: string) {
  const container: any = document.querySelector("#result-message");
  container.innerHTML = message;
}

document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.getElementById("formContainer");
  formContainer?.insertAdjacentHTML(
    "afterbegin",
    `
    <div id="paymentContainer" class="w-full justify-center flex-col items-center hidden">
        <div class="flex w-full items-start">
            <div id="backPayment" class="flex text-black text-sm cursor-pointer">
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
                </svg>
                <span>back</span>
            </div>
            <div id="slider" class="w-full text-center"></div>
        </div>
        <div id="paypal-button-container" class="w-3/4"></div>
        <div id="result-message"></div>
    </div>
    `
  );

  document.getElementById("backPayment")?.addEventListener("click", () => {
    const paymentContainer = document.getElementById(
      "paymentContainer"
    ) as HTMLElement;
    paymentContainer.classList.add("hidden");

    const userDetails = document.getElementById("userDetails") as HTMLElement;
    userDetails.classList.remove("hidden");
    userDetails.classList.add("flex");
  });
});
