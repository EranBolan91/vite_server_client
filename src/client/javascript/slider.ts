document.addEventListener("DOMContentLoaded", async () => {
  const slider = document.getElementById("slider");
  slider?.insertAdjacentHTML(
    "afterbegin",
    `
    <ul class="steps">
        <li class="step step-primary">Register</li>
        <li class="step step-primary">Choose plan</li>
        <li class="step">Purchase</li>
        <li class="step">Receive Product</li>
    </ul>
`
  );
});
