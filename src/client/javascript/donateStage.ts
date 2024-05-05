document.addEventListener("DOMContentLoaded", async () => {
  const formContainer = document.getElementById("formContainer");
  formContainer?.insertAdjacentHTML(
    "afterbegin",
    `<div
        id="donateStage"
        class="w-full  justify-center flex-col items-center flex"
      >
        <div id="slider" class="w-full text-center"></div>
        <div class="flex flex-col justify-start items-center w-full">
          <div role="tablist" class="tabs tabs-boxed tabs-sm md:tabs-md">
            <a role="tab" class="tab text-sm/[0px] md:text-md tab-active">Once</a>
            <a role="tab" class="tab text-sm/[0px] md:text-md">Weekly</a>
            <a role="tab" class="tab text-sm/[0px] md:text-md">Monthly</a>
          </div>
          <h2 class="text-black text-xl md:text-4xl font-medium mt-3 md:mt-6">HELP US</h2>
          <div class="grid grid-cols-2 gap-2 w-full mt-2 md:mt-5 p-2">
            <button
              class="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              60
            </button>
            <button
              class="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              180
            </button>
            <button
              class="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              360
            </button>
            <button
              class="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              540
            </button>
          </div>
          <div class="w-full p-2">
            <input
              type="number"
              placeholder="Enter custom amount"
              class="input input-bordered input-sm md:input-md w-full"
            />
          </div>
          <div class="p-2 w-full">
            <button id="next" class="btn btn-block btn-sm md:btn-md btn-primary">
              Next
            </button>
            <div class="grid grid-cols-5 place-items-center p-2">
              <img
                class="w-20"
                src="https://admin.raisely.com/public/donations/donationv3/applepay.png"
              />
              <img
                class="w-20"
                src="https://admin.raisely.com/public/donations/donationv3/gpay.png"
              />
              <img
                class="w-20"
                src="https://admin.raisely.com/public/donations/donationv3/visa.png"
              />
              <img
                class="w-20"
                src="https://admin.raisely.com/public/donations/donationv3/mastercard.png"
              />
              <img
                class="w-20"
                src="https://admin.raisely.com/public/donations/donationv3/americanexpress.png"
              />
            </div>
          </div>
        </div>
      </div>`
  );

  document.getElementById("next")?.addEventListener("click", () => {
    const userDetails = document.getElementById("userDetails") as HTMLElement;
    userDetails.classList.remove("hidden");
    userDetails.classList.add("flex");
    const donateStage = document.getElementById("donateStage") as HTMLElement;
    donateStage.classList.add("hidden");
    donateStage.classList.remove("flex");
  });

  const tabs = document.getElementsByClassName(
    "tab"
  ) as HTMLCollectionOf<HTMLElement>;

  const tabsArray = Array.from(tabs);

  tabsArray.forEach((tab: Element) => {
    tab.addEventListener("click", () => {
      tabsArray.forEach((tab: Element) => {
        tab.classList.remove("tab-active");
      });
      tab.classList.add("tab-active");
    });
  });
});
