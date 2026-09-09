const defaultData = {
  "Home": [
    ["▶️","YouTube","https://www.youtube.com/"],
    ["🤖","Lovable","https://lovable.dev/"],
    ["🖥️","MCServerHost","https://www.mcserverhost.com/"],
    ["🎬","YouTube Studio","https://studio.youtube.com/channel/UCjRad4l3DQ9_hNFhidsBmvw"]
  ],
  "Minecraft": [
    ["⛏️","Aternos","https://aternos.org/servers/"],
    ["🧩","Modrinth","https://modrinth.com/dashboard/projects"]
  ],
  "Discord": [
    ["🎫","Ticket Tool","https://tickettool.xyz/dashboard/1439599808884117506/configs#pc-menu/pc-moderator"]
  ],
  "Roblox": [
    ["🎮","Roblox","https://www.roblox.com/home"]
  ],
  "Tools": [
    ["📝","Google Forms","https://docs.google.com/forms/u/0/"],
    ["📸","CrunchLabs","https://space.crunchlabs.com/selfie/TLLrzej"]
  ],
  "AI Tools": [
    ["🤖","Lovable","https://lovable.dev/"]
  ],
  "Website Bouwers": []
};

let data = JSON.parse(localStorage.getItem("mijnLinksData") || "null") || defaultData;
let currentCategory = "Home";
let mode = "link";

function save() {
  localStorage.setItem("mijnLinksData", JSON.stringify(data));
  render();
}

function render() {
  const nav = document.getElementById("nav");
  const pages = document.getElementById("pages");
  nav.innerHTML = "";
  pages.innerHTML = "";

  Object.keys(data).forEach(category => {
    const wrap = document.createElement("div");
    wrap.className = "cat-wrap";

    const button = document.createElement("button");
    button.textContent = category === "Home" ? "🏠 Home" :
      category === "Minecraft" ? "⛏️ Minecraft" :
      category === "Discord" ? "💬 Discord" :
      category === "Roblox" ? "🎮 Roblox" :
      category === "Tools" ? "🛠️ Tools" :
      category === "AI Tools" ? "🤖 AI Tools" :
      category === "Website Bouwers" ? "🌐 Website Bouwers" : "📁 " + category;

    if (category === currentCategory) button.classList.add("active");
    button.onclick = () => {
      currentCategory = category;
      render();
    };
    wrap.appendChild(button);

    if (!["Home","Minecraft","Discord","Roblox","Tools","AI Tools","Website Bouwers"].includes(category)) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "cat-delete";
      deleteButton.textContent = "🗑️";
      deleteButton.title = "Categorie verwijderen";
      deleteButton.onclick = () => deleteCategory(category);
      wrap.appendChild(deleteButton);
    }

    nav.appendChild(wrap);

    const section = document.createElement("section");
    section.className = "page" + (category === currentCategory ? " active" : "");
    section.innerHTML = `
      <div class="page-head"><h2>${category}</h2></div>
      <div class="grid"></div>
      <button class="add" onclick="openLinkModal('${escapeQuotes(category)}')">＋ Link toevoegen</button>
    `;
    pages.appendChild(section);

    const grid = section.querySelector(".grid");

    data[category].forEach((item, index) => {
      const link = document.createElement("a");
      link.className = "link";
      link.href = item[2];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `
        <span class="icon">${item[0]}</span>
        <span>${item[1]}</span>
        <button class="delete" title="Link verwijderen"
          onclick="event.preventDefault();removeLink('${escapeQuotes(category)}',${index})">×</button>
      `;
      grid.appendChild(link);
    });
  });

  const addCategory = document.createElement("button");
  addCategory.textContent = "＋ Categorie toevoegen";
  addCategory.onclick = openCategoryModal;
  nav.appendChild(addCategory);
}

function escapeQuotes(text) {
  return text.replace(/'/g, "\\'");
}

function openLinkModal(category) {
  mode = "link";
  document.getElementById("modal").classList.add("show");
  document.getElementById("modalTitle").textContent = "🔗 Link toevoegen";
  document.getElementById("urlLabel").style.display = "block";
  document.getElementById("iconLabel").style.display = "block";
  document.getElementById("urlInput").style.display = "block";
  document.getElementById("iconInput").style.display = "block";
  document.getElementById("nameInput").value = "";
  document.getElementById("urlInput").value = "";
  document.getElementById("iconInput").value = "";
  document.getElementById("modal").dataset.category = category;
}

function openCategoryModal() {
  mode = "category";
  document.getElementById("modal").classList.add("show");
  document.getElementById("modalTitle").textContent = "📁 Categorie toevoegen";
  document.getElementById("urlLabel").style.display = "none";
  document.getElementById("iconLabel").style.display = "none";
  document.getElementById("urlInput").style.display = "none";
  document.getElementById("iconInput").style.display = "none";
  document.getElementById("nameInput").value = "";
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

function confirmAdd() {
  const name = document.getElementById("nameInput").value.trim();

  if (!name) {
    alert("Vul een naam in.");
    return;
  }

  if (mode === "category") {
    if (data[name]) {
      alert("Deze categorie bestaat al.");
      return;
    }
    data[name] = [];
    currentCategory = name;
    save();
    closeModal();
    return;
  }

  let url = document.getElementById("urlInput").value.trim();
  if (!url) {
    alert("Vul een URL in.");
    return;
  }

  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const icon = document.getElementById("iconInput").value.trim() || "🔗";
  const category = document.getElementById("modal").dataset.category;

  data[category].push([icon, name, url]);
  save();
  closeModal();
}

function removeLink(category, index) {
  if (confirm("Deze link verwijderen?")) {
    data[category].splice(index, 1);
    save();
  }
}

function deleteCategory(category) {
  if (confirm("Categorie '" + category + "' en alle links erin verwijderen?")) {
    delete data[category];
    currentCategory = "Home";
    save();
  }
}

render();
