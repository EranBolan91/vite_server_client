import "./style.css";
import { StripeElements, loadStripe } from "@stripe/stripe-js";

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0570de",
    colorBackground: "#ffffff",
    colorText: "#30313d",
    colorDanger: "#df1b41",
    fontFamily: "Ideal Sans, system-ui, sans-serif",
    spacingUnit: "2px",
    borderRadius: "4px",
  },
};

const options = {
  layout: {
    type: "tabs",
    defaultCollapsed: false,
  },
};

const handleError = (error: any) => {
  const submitBtn = document.getElementById(
    "submit"
  ) as HTMLButtonElement | null;

  const messageContainer = document.querySelector(
    "#error-message"
  ) as HTMLElement | null;

  if (messageContainer) {
    messageContainer.textContent = error.message;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
  }
};

const addFormEventListener = async (elements: StripeElements) => {
  const form = document.getElementById("payment-form");
  const submitBtn = document.getElementById(
    "submit"
  ) as HTMLButtonElement | null;

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Prevent multiple form submissions
    if (submitBtn !== null) {
      submitBtn.disabled = true;
    }

    // Trigger form validation and wallet collection
    // const { error: submitError } = await paymentElement?.submit();
    // if (submitError) {
    //   handleError(submitError);
    //   return;
    // }

    const { clientSecret } = await fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_method_types: ["card"],
        currency: "usd",
      }),
    }).then((response) => response.json());

    await stripe
      ?.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000/",
        },
      })
      .then((res) => console.log(res));
  });
};

window.onload = async () => {
  const elements = stripe?.elements({
    mode: "payment",
    amount: 1099,
    currency: "usd",
  });

  const paymentElement = elements?.create("payment", {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false,
    },
  });

  paymentElement?.mount("#payment-element");

  elements?.submit().then((result) => {
    console.log(result);
  });

  if (elements !== undefined) {
    addFormEventListener(elements);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("next")?.addEventListener("click", () => {
    console.log("clicked");
    const donateStage = document.getElementById("donateStage") as HTMLElement;
    donateStage.style.display = "none";
  });
});
