const productCatalog = new Map();
const categorySet = new Set();
const orderedProductIds = new Set();
const changeHistory = new WeakMap();
const modifiedProducts = new WeakSet();
const orderLog = [];

let nextId = 1;
let totalChanges = 0;


function genId() {
    return "P" + String(nextId++).padStart(3, "0");
}

function now() {
    return new Date().toLocaleTimeString("en-US");
}

function toast(msg, type = "info") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    document.getElementById("toasts").appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function addLog(msg, type = "") {
    const list = document.getElementById("change-log");
    const ph = list.querySelector(".log-entry:only-child");
    
    if (ph && ph.textContent.includes("empty")) ph.remove();

    const el = document.createElement("div");
    el.className = `log-entry ${type}`;
    el.textContent = `[${now()}] ${msg}`;
    list.prepend(el);
    totalChanges++;
    updateStats();
}

function switchTab(tab) {
    const tabs = ["add", "edit", "delete", "order"];
    document.querySelectorAll(".tab").forEach((t, i) => {
        t.classList.toggle("active", tabs[i] === tab);
    });
    document.querySelectorAll(".tab-content").forEach((c) => {
        c.classList.toggle("active", c.id === "tab-" + tab);
    });
}


function renderTable(filter = "") {
    const tbody = document.getElementById("product-table-body");
    const empty = document.getElementById("empty-catalog");
    tbody.innerHTML = "";

    const filterLow = filter.toLowerCase();
    let count = 0;

    productCatalog.forEach((p, id) => {
        if (filter && !p.name.toLowerCase().includes(filterLow)) return;
        count++;

        const wasModified = modifiedProducts.has(p);
        const qtyClass = p.qty <= 3 ? "qty-low" : "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="id-cell">${id}${wasModified ? " ✱" : ""}</td>
            <td class="name-cell">${p.name}</td>
            <td class="price-cell">$${p.price.toLocaleString("en-US")}</td>
            <td class="qty-cell ${qtyClass}">${p.qty} ${p.qty <= 3 ? "⚠" : ""}</td>
            <td><span class="cat-pill">${p.category}</span></td>
            <td class="actions-cell">
                <button class="icon-btn" title="Edit" onclick="openEditModal('${id}')">✏️</button>
                <button class="icon-btn del" title="Delete" onclick="deleteById('${id}')">🗑</button>
                <button class="icon-btn" title="Order 1 pc" onclick="quickOrder('${id}')">🛒</button>
            </td>`;
        tbody.appendChild(tr);
    });

    empty.style.display = count === 0 ? "block" : "none";
    updateStats();
}

function renderOrders() {
    const list = document.getElementById("order-list");
    list.innerHTML = "";
    
    if (orderLog.length === 0) {
        list.innerHTML = '<div class="empty-state" style="padding:20px"><div class="big" style="font-size:1.5rem">📋</div>No orders yet</div>';
        return;
    }

    [...orderLog].reverse().forEach((o) => {
        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
            <span class="o-id">#${o.orderId}</span>
            <span class="o-name">${o.name}</span>
            <span class="o-qty">×${o.qty}</span>
            <span class="o-date">${o.time}</span>`;
        list.appendChild(div);
    });
}

function updateStats() {
    document.getElementById("stat-products").textContent = productCatalog.size;
    document.getElementById("stat-cats").textContent = categorySet.size;
    document.getElementById("stat-orders").textContent = orderLog.length;
    document.getElementById("stat-changes").textContent = totalChanges;
}

function addProduct() {
    const name = document.getElementById("add-name").value.trim();
    const price = parseFloat(document.getElementById("add-price").value);
    const qty = parseInt(document.getElementById("add-qty").value);
    const cat = document.getElementById("add-cat").value.trim() || "General";

    if (!name) return toast("Enter product name", "error");
    if (isNaN(price) || price < 0) return toast("Invalid price", "error");
    if (isNaN(qty) || qty < 0) return toast("Invalid quantity", "error");

    const id = genId();
    const product = { id, name, price, qty, category: cat };

    productCatalog.set(id, product);
    categorySet.add(cat);
    changeHistory.set(product, [{ type: "created", time: now(), price, qty }]);

    addLog(`Added: "${name}" (${id}), Price: $${price}, Qty: ${qty}`, "add");
    toast(`Product "${name}" added!`, "success");

    ["add-name", "add-price", "add-qty", "add-cat"].forEach(f => document.getElementById(f).value = "");
    renderTable();
}

function deleteProduct() {
    const id = document.getElementById("del-id").value.trim().toUpperCase();
    deleteById(id);
    document.getElementById("del-id").value = "";
}

function deleteById(id) {
    if (!productCatalog.has(id)) return toast(`Product "${id}" not found`, "error");

    const p = productCatalog.get(id);
    productCatalog.delete(id);

    addLog(`Deleted: "${p.name}" (${id})`, "del");
    toast(`Product "${p.name}" deleted`, "warn");
    renderTable();
}

function updateProduct() {
    const id = document.getElementById("edit-id").value.trim().toUpperCase();
    const price = document.getElementById("edit-price").value;
    const qty = document.getElementById("edit-qty").value;
    
    applyUpdate(id, price, qty);
    ["edit-id", "edit-price", "edit-qty"].forEach(f => document.getElementById(f).value = "");
}

function applyUpdate(id, priceStr, qtyStr) {
    if (!productCatalog.has(id)) return toast(`Product "${id}" not found`, "error");

    const p = productCatalog.get(id);
    const changes = {};

    if (priceStr !== "" && priceStr !== null) {
        const np = parseFloat(priceStr);
        if (!isNaN(np) && np >= 0) {
            changes.oldPrice = p.price;
            p.price = np;
            changes.newPrice = np;
        }
    }
    if (qtyStr !== "" && qtyStr !== null) {
        const nq = parseInt(qtyStr);
        if (!isNaN(nq) && nq >= 0) {
            changes.oldQty = p.qty;
            p.qty = nq;
            changes.newQty = nq;
        }
    }

    if (Object.keys(changes).length === 0) return toast("No changes to save", "warn");

    if (changeHistory.has(p)) {
        changeHistory.get(p).push({ type: "updated", time: now(), ...changes });
    }

    modifiedProducts.add(p);

    const msg = `Updated "${p.name}" (${id}):` +
        (changes.newPrice !== undefined ? ` Price $${changes.oldPrice}→$${changes.newPrice}` : "") +
        (changes.newQty !== undefined ? ` Qty ${changes.oldQty}→${changes.newQty}` : "");

    addLog(msg, "edit");
    toast(`Product "${p.name}" updated!`, "success");
    renderTable();
}

function searchProducts() {
    const q = document.getElementById("search-input").value.trim();
    if (!q) return renderTable();
    
    renderTable(q);
    const found = [...productCatalog.values()].filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    
    toast(found.length ? `Found: ${found.length} product(s)` : "Nothing found", found.length ? "info" : "warn");
}

function clearSearch() {
    document.getElementById("search-input").value = "";
    renderTable();
}

function placeOrder() {
    const id = document.getElementById("ord-id").value.trim().toUpperCase();
    const qty = parseInt(document.getElementById("ord-qty").value);
    processOrder(id, qty);
    document.getElementById("ord-id").value = "";
    document.getElementById("ord-qty").value = "1";
}

function quickOrder(id) {
    processOrder(id, 1);
}

function processOrder(id, qty) {
    if (!productCatalog.has(id)) return toast(`Product "${id}" not found`, "error");
    if (isNaN(qty) || qty <= 0) return toast("Invalid order quantity", "error");

    const p = productCatalog.get(id);
    if (p.qty < qty) return toast(`Insufficient stock! In stock: ${p.qty}`, "error");

    p.qty -= qty;
    orderedProductIds.add(id);

    if (changeHistory.has(p)) {
        changeHistory.get(p).push({ type: "order", time: now(), qty, remaining: p.qty });
    }

    const orderId = "ORD" + String(orderLog.length + 1).padStart(4, "0");
    orderLog.push({ orderId, name: p.name, qty, time: now(), productId: id });

    addLog(`Order ${orderId}: "${p.name}" ×${qty}, remaining: ${p.qty}`, "order");
    toast(`Order placed! Remaining: ${p.qty} pcs.`, "success");

    renderTable();
    renderOrders();
}


function openEditModal(id) {
    const p = productCatalog.get(id);
    if (!p) return;
    document.getElementById("modal-id").value = id;
    document.getElementById("modal-price").value = p.price;
    document.getElementById("modal-qty").value = p.qty;
    document.getElementById("modal-bg").classList.add("open");
}

function closeModal() {
    document.getElementById("modal-bg").classList.remove("open");
}

function confirmModalEdit() {
    const id = document.getElementById("modal-id").value;
    const price = document.getElementById("modal-price").value;
    const qty = document.getElementById("modal-qty").value;
    applyUpdate(id, price, qty);
    closeModal();
}

document.getElementById("modal-bg").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
});


function seedData() {
    const items = [
        { name: 'Laptop Pro 15"', price: 1200, qty: 8, cat: "Electronics" },
        { name: "Wireless Headphones", price: 150, qty: 25, cat: "Electronics" },
        { name: "Mechanical Keyboard", price: 80, qty: 15, cat: "Peripherals" },
        { name: "RGB Gaming Mouse", price: 45, qty: 3, cat: "Peripherals" },
        { name: "USB-C Hub 7-in-1", price: 60, qty: 20, cat: "Accessories" },
    ];

    items.forEach(({ name, price, qty, cat }) => {
        const id = genId();
        const product = { id, name, price, qty, category: cat };
        productCatalog.set(id, product);
        categorySet.add(cat);
        changeHistory.set(product, [{ type: "created", time: now(), price, qty }]);
    });

    addLog("Catalog initialized with demo data", "add");
    renderTable();
    updateStats();
}

document.getElementById("search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchProducts();
});

seedData();