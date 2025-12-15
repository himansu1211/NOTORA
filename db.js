const DB_NAME = "Notora_db";
const DB_VERSION = 1;
let db;

function initDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore("notes", { keyPath: "id" });
      db.createObjectStore("files", { keyPath: "id" });
    };

    request.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });
}

function save(store, data) {
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).put(data);
}

function getAll(store) {
  return new Promise(resolve => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

function get(store, id) {
  return new Promise(resolve => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result);
  });
}
export { initDB, save, getAll, get };
  for (const file of files) {
    const fileId = crypto.randomUUID();
    const fileData = { id: fileId, name: file.name, type: file.type };
    save("files", fileData);
    note.files.push(fileId);
  }
    filesList.innerHTML = "";
    for (const id of ids) {
        const fileData = await get("files", id);
        const li = document.createElement("li");
        li.textContent = fileData.name;
        filesList.appendChild(li);
    }
