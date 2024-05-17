export const changeStep = (index: string) => {
  const steps = document.querySelectorAll<HTMLElement>(".step");
  steps.forEach((step) => {
    if ((step?.dataset?.step ?? "0") <= index) {
      step.classList.add("step-success");
    } else {
      step.classList.remove("step-success");
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const slider = document.getElementById("slider");
  const steps = document.querySelectorAll<HTMLElement>(".step");
  if (steps.length === 0) {
    slider?.insertAdjacentHTML(
      "afterbegin",
      `
    <ul class="steps steps-horizontal mb-3">
        <li class="step step-success" data-step="0"></li>
        <li class="step" data-step="1"></li>
        <li class="step" data-step="2"></li>
    </ul>
`
    );
  }
});
