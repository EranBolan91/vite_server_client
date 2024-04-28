document.addEventListener("DOMContentLoaded", async () => {
  const slider = document.getElementById("about");
  slider?.insertAdjacentHTML(
    "afterbegin",
    `<div class="flex flex-col w-3/5 p-20">
        <h1 class="text-3xl font-bold text-left">About</h1>
        <p class="text-left mt-4 leading-8 text-lg">
          The United Nations and humanitarian partners are delivering life-saving assistance.
          Your donation will go to the Occupied Palestinian Territory Humanitarian Fund – one of the quickest and most effective ways to support urgent relief on the ground.
          The Fund collects contributions continuously so it can directly support a wide range of partners to address the highest priority humanitarian activities.
          The Fund is managed by the United Office for the Coordination of Humanitarian Affairs on behalf of the Humanitarian Coordinator.
        </p>
    </div>`
  );
});
