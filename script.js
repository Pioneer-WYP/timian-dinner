const PASSCODE = "体面";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvu6mBijrG52wkGnqA6VK-Q_DX1jnosVKBSETiA1lY_-DXAglIo6_zrfYE3mWMoahjQQ/exec";

const dishes = {
  main: [
    "土豆肉沫",
    "辣椒炒肉",
    "辣鸡翅",
    "干煸虾仁",
    "葱烧豆腐",
    "糖醋排骨",
    "山东炒鸡",
    "咖喱菇虾",
    "溜肉段",
    "煎牛排",
    "蒜香黄油岩盐烤大红虾",
  ],
  veggie: ["蚝油生菜", "清炒扁豆丝", "高汤娃娃菜", "丝瓜", "沙拉拼盘"],
};

const gateScreen = document.querySelector("#gateScreen");
const inviteScreen = document.querySelector("#inviteScreen");
const gateForm = document.querySelector("#gateForm");
const gateError = document.querySelector("#gateError");
const passcodeInput = document.querySelector("#passcode");
const passcodeHint = document.querySelector("#passcodeHint");
const orderForm = document.querySelector("#orderForm");
const formError = document.querySelector("#formError");
const submitButton = document.querySelector("#submitButton");
const successPanel = document.querySelector("#successPanel");
const successName = document.querySelector("#successName");
const successDishes = document.querySelector("#successDishes");
const closeCountdown = document.querySelector("#closeCountdown");
let closeTimer = null;

function renderDishes(containerId, items) {
  const container = document.querySelector(containerId);
  container.innerHTML = items
    .map(
      (dish) => `
        <label class="dish-option">
          <input type="checkbox" name="dishes" value="${dish}" />
          <span>${dish}</span>
        </label>
      `,
    )
    .join("");
}

function selectedDishes() {
  return [...document.querySelectorAll('input[name="dishes"]:checked')].map((input) => input.value);
}

function showSelected(items, extraRequest) {
  const allItems = [...items];
  if (extraRequest.trim()) {
    allItems.push(`还想吃：${extraRequest.trim()}`);
  }

  successDishes.innerHTML = allItems.length
    ? allItems.map((item) => `<span>${item}</span>`).join("")
    : "<span>今日选择：交给王老板发挥</span>";
}

async function submitToGoogleSheet(payload) {
  if (!GOOGLE_SCRIPT_URL) {
    console.info("Google Script URL is empty. Submission blocked:", payload);
    throw new Error("GOOGLE_SCRIPT_URL is not configured.");
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  return response;
}

gateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const passcode = new FormData(gateForm).get("passcode").trim();

  if (passcode !== PASSCODE) {
    gateError.textContent = "暗号不对，再体面地想一想。";
    return;
  }

  gateError.textContent = "";
  gateScreen.classList.add("hidden");
  inviteScreen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "auto" });
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";

  const formData = new FormData(orderForm);
  const guestName = formData.get("guestName").trim();
  const dietaryNotes = formData.get("dietaryNotes").trim();
  const extraRequest = formData.get("extraRequest").trim();
  const choices = selectedDishes();

  if (!guestName) {
    formError.textContent = "先留个姓名，王老板好按人头体面。";
    orderForm.elements.guestName.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "正在提交...";

  const payload = {
    submittedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    guestName,
    dietaryNotes,
    dishes: choices.join("、"),
    extraRequest,
  };

  try {
    await submitToGoogleSheet(payload);
    successName.textContent = `${guestName} 的菜单已收到。`;
    showSelected(choices, extraRequest);
    successPanel.classList.remove("hidden");
    orderForm.reset();
    startAutoClose();
  } catch (error) {
    formError.textContent = GOOGLE_SCRIPT_URL
      ? "提交时卡了一下，请稍后再试。"
      : "Google 表格接收地址还没配置，先别把链接发出去。";
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "提交我的体面菜单";
  }
});

passcodeHint.addEventListener("click", () => {
  passcodeInput.value = PASSCODE;
  passcodeInput.focus();
  gateError.textContent = "";
});

function startAutoClose() {
  let seconds = 10;
  closeCountdown.textContent = seconds;
  clearInterval(closeTimer);

  closeTimer = setInterval(() => {
    seconds -= 1;
    closeCountdown.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(closeTimer);
      window.close();
      document.body.innerHTML = `
        <main class="closed-screen">
          <h1>菜单已收到</h1>
          <p>王老板真是体面！现在可以关闭这个页面了。</p>
        </main>
      `;
    }
  }, 1000);
}

renderDishes("#mainDishes", dishes.main);
renderDishes("#veggieDishes", dishes.veggie);
