const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const toast = document.getElementById("toast");

let products = [
    {
        id: Date.now() + 1,
        name: "Ноутбук Acer Pro",
        price: 45000,
        category: "electronics",
        image: "https://skymarket.ua/image/cache/catalog/products/app/ec/254/acer-conceptd-3-pro-cn315-71p-800x800.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 2,
        name: "iPhone 14",
        price: 38000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 3,
        name: "Samsung Galaxy S23",
        price: 35000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 4,
        name: "AirPods Pro",
        price: 9000,
        category: "electronics",
        image: "https://mobileplanet.ua/uploads/small_photos/2023-9-27/apple-airpods-pro-2nd-generation-with-magsafe-char-287824_1.webp",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },

    {
        id: Date.now() + 5,
        name: "Футболка Nike",
        price: 1200,
        category: "clothes",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZOY2zgJMOAfUih2qaNFigPbO4bVNIhSdtEQ&s",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 6,
        name: "Джинси Levi’s",
        price: 2500,
        category: "clothes",
        image: "https://denim.ua/image/cache/catalog/levis505mediumstonewash01-700x900.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 7,
        name: "Худі Adidas",
        price: 3000,
        category: "clothes",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_FXk0UEWA63_Mt_vmTeo9hfV0cgq7XAlX1g&s",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 8,
        name: "Кросівки Puma",
        price: 4200,
        category: "clothes",
        image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/392982/02/fnd/UKR/w/1000/h/1000/fmt/png",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },

    {
        id: Date.now() + 9,
        name: "Шоколад Milka",
        price: 80,
        category: "food",
        image: "https://alcoshop.ua/image/cache/catalog/image/catalog/shoko/1202-5.webp",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 10,
        name: "Кава Jacobs",
        price: 250,
        category: "food",
        image: "https://aquamarket.ua/19354-large_default/jacobs-monarch-95-g-kofe-yakobs-monarkh-rastvorimyj.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 11,
        name: "Чай Lipton",
        price: 120,
        category: "food",
        image: "https://i.evrasia.in.ua/data/1400_0/products/KUnXAaAOCyHUlzpEROZLUjTOfMjEknZftHSan5CX.webp",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 12,
        name: "Печиво Oreo",
        price: 90,
        category: "food",
        image: "https://safaritrade.com.ua/wp-content/uploads/2020/09/000001688.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },

    {
        id: Date.now() + 13,
        name: "Мишка Logitech",
        price: 1500,
        category: "electronics",
        image: "https://brain.com.ua/static/images/prod_img/3/5/U0443335_1739986633.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 14,
        name: "Клавіатура Razer",
        price: 4000,
        category: "electronics",
        image: "https://api.e-server.com.ua/storage/149837/rs/U0480240_2big___rs_1200_1200.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },

    {
        id: Date.now() + 15,
        name: "Куртка зимова",
        price: 5200,
        category: "clothes",
        image: "https://southoriginals.com.ua/upload/948bb669994a4c03904394ff9e7f8fc7.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 16,
        name: "Шапка зимова",
        price: 500,
        category: "clothes",
        image: "https://valeotrikotage.com/assets/cache/images/6821b211ac424267cd689fdc22145680.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },

    {
        id: Date.now() + 17,
        name: "Сік Jaffa",
        price: 60,
        category: "food",
        image: "https://vitmark.com/wp-content/uploads/2025/09/juice-nectars-500-500.png",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 18,
        name: "Йогурт Danone",
        price: 45,
        category: "food",
        image: "https://vip.shuvar.com/media/catalog/product/cache/178b2511d7a06ad936c489e3e0e2d6f6/3/6/367f9085-e6ee-3f3c-5c2b-9b771ba7e8b0.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },

    {
        id: Date.now() + 19,
        name: "Монітор Samsung",
        price: 8000,
        category: "electronics",
        image: "https://content.rozetka.com.ua/goods/images/big/575066802.jpg",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: Date.now() + 20,
        name: "Павербанк Xiaomi",
        price: 1200,
        category: "electronics",
        image: "https://i.allo.ua/media/Rich_Review/Xiaomi_10000mAh/1m.webp",
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

let editingId = null;
let currentFilter = "all";
let currentSort = null;

const createProduct = (data) => ({
    id: Date.now(),
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now()
});

const filterProducts = (items, filter) =>
    filter === "all" ? items : items.filter(p => p.category === filter);

const sortProducts = (items, sort) => {
    if (!sort) return items;
    return [...items].sort((a, b) => {
        if (sort === "price") return a.price - b.price;
        if (sort === "created") return a.createdAt - b.createdAt;
        if (sort === "updated") return a.updatedAt - b.updatedAt;
    });
};

const totalPrice = (items) =>
    items.reduce((sum, p) => sum + p.price, 0);

const list = document.getElementById("list");
const empty = document.getElementById("empty");
const total = document.getElementById("total");

const render = () => {
    list.innerHTML = "";

    let view = sortProducts(filterProducts(products, currentFilter), currentSort);

    empty.style.display = view.length ? "none" : "block";

    view.forEach(p => {
        const card = document.createElement("div");
        card.className = "card enter";

        card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="card-info-row"> 
        <p class="price">${p.price} грн</p>
        <p class="panel panel--tag">${p.category}</p>
      <div>
      <div class="card-control-row"> 
        <button class="panel panel--button panel--button--edit" onclick="edit(${p.id})">Редагувати</button>
        <button class="panel panel--button panel--button--delete" onclick="remove(${p.id})">Видалити</button>
      <div>
     
    `;

        list.appendChild(card);
    });

    total.textContent = "Загальна сума: " + totalPrice(products) + " грн";
};

const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
};

document.getElementById("addBtn").onclick = () => {
    editingId = null;
    modal.classList.remove("hidden");
};

form.onsubmit = (e) => {
    e.preventDefault();

    const data = {
        name: nameInput.value,
        price: +priceInput.value,
        category: categoryInput.value,
        image: imageInput.value
    };

    if (editingId) {
        products = products.map(p =>
            p.id === editingId
                ? { ...p, ...data, updatedAt: Date.now() }
                : p
        );
        showToast("Оновлено!");
    } else {
        products.push(createProduct(data));
        showToast("Додано!");
    }

    form.reset(); 
    modal.classList.add("hidden");
    render();
};

const getMax = (array) => {
    return array.sort((a, b),  a > b ? a : b)
} 

window.remove = (id) => {
    products = products.filter(p => p.id !== id);
    showToast("Видалено!");
    render();
};

window.edit = (id) => {
    const p = products.find(p => p.id === id);

    editingId = id;

    nameInput.value = p.name;
    priceInput.value = p.price;
    categoryInput.value = p.category;
    imageInput.value = p.image;

    modal.classList.remove("hidden");
};

document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.onclick = () => {
        currentFilter = btn.dataset.filter;
        render();
    };
});

document.querySelectorAll("[data-sort]").forEach(btn => {
    btn.onclick = () => {
        currentSort = btn.dataset.sort;
        render();
    };
});

document.getElementById("resetSort").onclick = () => {
    currentSort = null;
    render();
};

render();