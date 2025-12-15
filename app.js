let currentNoteId = null;
let saveTimer = null;

const notesList = document.getElementById("notesList");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const fileInput = document.getElementById("fileInput");
const filesList = document.getElementById("filesList");
const linkPreview = document.getElementById("linkPreview");

document.getElementById("newNoteBtn").onclick = createNote;
document.getElementById("exportText").onclick = exportText;
document.getElementById("exportImage").onclick = exportImage;

initDB().then(loadNotes);

async function loadNotes() {
  notesList.innerHTML = "";
  const notes = await getAll("notes");
  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n.title || "Untitled";
    li.onclick = () => openNote(n.id);
    notesList.appendChild(li);
  });
}

function createNote() {
  const id = crypto.randomUUID();
  save("notes", { id, title: "", content: "", files: [] });
  loadNotes();
  openNote(id);
}

async function openNote(id) {
  const note = await get("notes", id);
  currentNoteId = id;
  noteTitle.value = note.title;
  noteContent.value = note.content;
  renderFiles(note.files);
}

function autosave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const note = await get("notes", currentNoteId);
    note.title = noteTitle.value;
    note.content = noteContent.value;
    save("notes", note);
    detectLinkPreview(note.content);
    loadNotes();
  }, 600);
}

noteTitle.oninput = autosave;
noteContent.oninput = autosave;

fileInput.onchange = async e => {
  const files = [...e.target.files];
  const note = await get("notes", currentNoteId);

  for (const f of files) {
    const id = crypto.randomUUID();
    save("files", { id, name: f.name, type: f.type, blob: f });
    note.files.push(id);
  }

  save("notes", note);
  renderFiles(note.files);
};

async function renderFiles(ids) {
  filesList.innerHTML = "";

  for (const id of ids) {
    const f = await get("files", id);
    const div = document.createElement("div");
    div.className = "file-item";

    if (f.type.startsWith("image")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(f.blob);
      img.onclick = () => showImage(img.src);
      div.appendChild(img);
    }
    else if (f.type === "application/pdf") {
      const iframe = document.createElement("iframe");
      iframe.src = URL.createObjectURL(f.blob);
      div.appendChild(iframe);
    }
    else {
      div.textContent = f.name;
    }

    filesList.appendChild(div);
  }
}

function showImage(src) {
  document.getElementById("modalImg").src = src;
  document.getElementById("imageModal").style.display = "flex";
}

function exportText() {
  const text = `${noteTitle.value}\n\n${noteContent.value}`;
  const blob = new Blob([text], { type: "text/plain" });
  download(blob, `${noteTitle.value || "note"}.txt`);
}

function exportImage() {
  html2canvas(document.getElementById("noteArea")).then(canvas => {
    canvas.toBlob(blob => {
      download(blob, `${noteTitle.value || "note"}.png`);
    });
  });
}

function download(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function detectLinkPreview(text) {
  const match = text.match(/https?:\/\/\S+/);
  if (!match || !navigator.onLine) return;

  linkPreview.innerHTML = `🔗 ${match[0]}`;
}
