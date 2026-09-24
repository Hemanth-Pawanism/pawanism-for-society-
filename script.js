const state = JSON.parse(localStorage.getItem("pawanismContent") || '{"videos":[],"photos":[],"articles":[]}');

const $ = id => document.getElementById(id);
const save = () => localStorage.setItem("pawanismContent", JSON.stringify(state));

function render() {
  renderVideos(); renderPhotos(); renderArticles();
  $("videoCount").textContent = state.videos.length;
  $("photoCount").textContent = state.photos.length;
  $("articleCount").textContent = state.articles.length;
}
function setGrid(id, items, builder, emptyText) {
  const grid = $(id);
  grid.innerHTML = "";
  if (!items.length) { grid.className = "content-grid empty"; grid.textContent = emptyText; return; }
  grid.className = id === "articleGrid" ? "article-grid" : "content-grid";
  items.forEach(item => grid.insertAdjacentHTML("beforeend", builder(item)));
}
function renderVideos() {
  setGrid("videoGrid", state.videos, v => `<article class="media-card"><video controls src="${v.url}"></video><div class="card-body"><h3>${escapeHtml(v.title)}</h3><p>Added video</p></div></article>`, "No videos added yet.");
}
function renderPhotos() {
  setGrid("photoGrid", state.photos, p => `<article class="media-card"><img src="${p.url}" alt="${escapeHtml(p.title)}"><div class="card-body"><h3>${escapeHtml(p.title)}</h3></div></article>`, "No photos added yet.");
}
function renderArticles() {
  setGrid("articleGrid", state.articles, a => `<article class="article-card"><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.description || "Read this useful article.")}</p><a href="${a.url}" target="_blank" rel="noopener noreferrer">Read article ↗</a></article>`, "No articles added yet.");
}
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
$("videoForm").addEventListener("submit", async e => {
  e.preventDefault();
  const file = $("videoFile").files[0];
  if (!file) return;
  state.videos.push({title: $("videoTitle").value, url: await readFile(file)});
  save(); render(); e.target.reset(); alert("Video added.");
});
$("photoForm").addEventListener("submit", async e => {
  e.preventDefault();
  const file = $("photoFile").files[0];
  if (!file) return;
  state.photos.push({title: $("photoTitle").value, url: await readFile(file)});
  save(); render(); e.target.reset(); alert("Photo added.");
});
$("articleForm").addEventListener("submit", e => {
  e.preventDefault();
  state.articles.push({title: $("articleTitle").value, url: $("articleUrl").value, description: $("articleDescription").value});
  save(); render(); e.target.reset(); alert("Article link added.");
});
$("clearAll").addEventListener("click", () => {
  if (confirm("Delete all saved videos, photos, and articles from this browser?")) {
    state.videos = []; state.photos = []; state.articles = [];
    save(); render();
  }
});
$("year").textContent = new Date().getFullYear();
render();
