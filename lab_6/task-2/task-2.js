const titleInput = document.getElementById("title");
const modal = document.getElementById("modal");
const form = document.getElementById("form");

let tasks = [
  {
    id: Date.now() + 1,
    title: "Зробити лабораторну №6",
    done: false,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 1000000
  },
  {
    id: Date.now() + 2,
    title: "Повторити JavaScript",
    done: true,
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 500000
  },
  {
    id: Date.now() + 3,
    title: "Здати домашку",
    done: false,
    createdAt: Date.now() - 800000,
    updatedAt: Date.now() - 800000
  },
  {
    id: Date.now() + 4,
    title: "Піти в зал",
    done: true,
    createdAt: Date.now() - 700000,
    updatedAt: Date.now() - 300000
  },
  {
    id: Date.now() + 5,
    title: "Купити продукти",
    done: false,
    createdAt: Date.now() - 600000,
    updatedAt: Date.now() - 600000
  },
  {
    id: Date.now() + 6,
    title: "Подивитись лекцію",
    done: true,
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 200000
  },
  {
    id: Date.now() + 7,
    title: "Попрацювати над проєктом",
    done: false,
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 400000
  },
  {
    id: Date.now() + 8,
    title: "Зустрітись з друзями",
    done: true,
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 100000
  }
];
let editingId = null;
let currentFilter = "all";
let currentSort = null;

const createTask = (title) => ({
  id: Date.now(),
  title,
  done: false,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

const filterTasks = (items, filter) => {
  if (filter === "done") return items.filter(t => t.done);
  if (filter === "todo") return items.filter(t => !t.done);
  return items;
};

const sortTasks = (items, sort) => {
  if (!sort) return items;

  return [...items].sort((a, b) => {
    if (sort === "created") return a.createdAt - b.createdAt;
    if (sort === "updated") return a.updatedAt - b.updatedAt;
    if (sort === "done") return a.done - b.done;
  });
};

const list = document.getElementById("list");
const empty = document.getElementById("empty");
const total = document.getElementById("total");
const done = document.getElementById("done");
const todo = document.getElementById("todo");

const render = () => {
  list.innerHTML = "";

  let view = sortTasks(filterTasks(tasks, currentFilter), currentSort);

  empty.style.display = view.length ? "none" : "block";
  total.textContent = "Всього задач: " + tasks.length;
  done.textContent = "Виконаних: " + tasks.filter(t => t.done).length;
  todo.textContent = "Впроцесі: " + tasks.filter(t => !t.done).length;

  view.forEach(t => {
    const div = document.createElement("div");
    div.className = "task" + (t.done ? " done" : "");

    div.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${t.done ? "checked" : ""} onclick="toggle(${t.id})">
        <span ondblclick="edit(${t.id})">${t.title}</span>
      </div>

      <div class="actions">
        <button class="panel panel--button panel--button--delete" onclick="removeTask(${t.id})">
          Видалити
        </button>
      </div>
    `;

    list.appendChild(div);
  });
};

const showToast = (text) => {
  const toast = document.getElementById("toast");
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

  if (editingId) {
    tasks = tasks.map(t =>
      t.id === editingId
        ? { ...t, title: titleInput.value, updatedAt: Date.now() }
        : t
    );
    showToast("Оновлено!");
  } else {
    tasks.push(createTask(titleInput.value));
    showToast("Додано!");
  }

  form.reset();
  modal.classList.add("hidden");
  render();
};

window.toggle = (id) => {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  render();
};

window.removeTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
  showToast("Видалено!");
  render();
};

window.edit = (id) => {
  const t = tasks.find(t => t.id === id);

  editingId = id;
  titleInput.value = t.title;

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