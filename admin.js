const adminForm = document.querySelector("#adminForm");
const adminCode = document.querySelector("#adminCode");
const adminCodeHint = document.querySelector("#adminCodeHint");
const adminError = document.querySelector("#adminError");
const adminResults = document.querySelector("#adminResults");
const ordersList = document.querySelector("#ordersList");
const exportCsv = document.querySelector("#exportCsv");

let currentOrders = [];

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersList.innerHTML = '<p class="empty-state">还没有收到菜单。</p>';
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
        <article class="order-item">
          <div>
            <strong>${escapeHtml(order.guestName)}</strong>
            <span>${escapeHtml(order.submittedAt)}</span>
          </div>
          <p><b>忌口：</b>${escapeHtml(order.dietaryNotes) || "无"}</p>
          <p><b>选择菜品：</b>${escapeHtml(order.dishes) || "交给王老板发挥"}</p>
          <p><b>其他想吃：</b>${escapeHtml(order.extraRequest) || "无"}</p>
        </article>
      `,
    )
    .join("");
}

function csvValue(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function downloadCsv() {
  const header = ["提交时间", "姓名", "忌口", "选择菜品", "其他想吃的"];
  const rows = currentOrders.map((order) => [
    order.submittedAt,
    order.guestName,
    order.dietaryNotes,
    order.dishes,
    order.extraRequest,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "点菜结果.csv";
  link.click();
  URL.revokeObjectURL(url);
}

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  adminError.textContent = "";

  try {
    const response = await fetch(`/api/orders?code=${encodeURIComponent(adminCode.value.trim())}`);

    if (!response.ok) {
      throw new Error("后台口令不对，或者国内数据服务还没配置好。");
    }

    const data = await response.json();
    currentOrders = data.orders || [];
    renderOrders(currentOrders);
    adminResults.classList.remove("hidden");
  } catch (error) {
    adminError.textContent = error.message;
  }
});

exportCsv.addEventListener("click", downloadCsv);

adminCodeHint.addEventListener("click", () => {
  adminCode.value = "体面老板";
  adminCode.focus();
  adminError.textContent = "";
});
