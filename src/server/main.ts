import express from "express";
import ViteExpress from "vite-express";
const { resolve } = require("path");
require("dotenv").config({ path: ".env" });
const app = express();

const paypal = require("@paypal/checkout-server-sdk");
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/<your-sample-name>",
    version: "0.0.1",
    url: "https://github.com/stripe-samples",
  },
});

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req: any, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.get("/", async (_, res) => {
  const path = resolve("index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { paymentMethodType, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: currency,
      payment_method_types: [paymentMethodType],
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.log("Error:", err);
    res.status(400).json({ error: { message: err.message } });
  }
});

const storeItems = new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }],
]);

app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  const total = req.body.items.reduce((sum: any, item: any) => {
    return sum + storeItems.get(item.id).price * item.quantity;
  }, 0);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map((item: any) => {
          const storeItem = storeItems.get(item.id);
          return {
            name: storeItem?.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem?.price,
            },
            quantity: item.quantity,
          };
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
