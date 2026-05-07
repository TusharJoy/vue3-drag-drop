<script setup>
import { ref } from "vue";
import { Drag, Drop } from "./components/index";

// ── Kanban ──
const kanbanCols = ref([
  { id: "todo",       label: "Todo",        color: "#6366f1", cards: [
    { id: "k1", text: "Design mockups" },
    { id: "k2", text: "Write tests" },
    { id: "k3", text: "Review PRs" },
  ]},
  { id: "inprogress", label: "In Progress", color: "#f59e0b", cards: [
    { id: "k4", text: "Implement auth" },
  ]},
  { id: "done",       label: "Done",        color: "#22c55e", cards: [
    { id: "k5", text: "Setup CI" },
  ]},
]);

function kanbanDrop(targetColId, card) {
  for (const col of kanbanCols.value) {
    col.cards = col.cards.filter((c) => c.id !== card.id);
  }
  const target = kanbanCols.value.find((c) => c.id === targetColId);
  if (target) target.cards.push(card);
}

// ── Sortable list ──
const sortableItems = ref([
  { id: "s1", label: "First item",  color: "#6366f1" },
  { id: "s2", label: "Second item", color: "#f59e0b" },
  { id: "s3", label: "Third item",  color: "#22c55e" },
  { id: "s4", label: "Fourth item", color: "#ef4444" },
  { id: "s5", label: "Fifth item",  color: "#8b5cf6" },
]);
const sortableDragId = ref(null);
const sortableOverId = ref(null);

function sortableDragStart(item) {
  sortableDragId.value = item.id;
}

function sortableDragEnd() {
  sortableDragId.value = null;
  sortableOverId.value = null;
}

function sortableDrop(targetItem) {
  if (!sortableDragId.value || sortableDragId.value === targetItem.id) return;
  const from = sortableItems.value.findIndex((i) => i.id === sortableDragId.value);
  const to   = sortableItems.value.findIndex((i) => i.id === targetItem.id);
  const moved = sortableItems.value.splice(from, 1)[0];
  sortableItems.value.splice(from < to ? to - 1 : to, 0, moved);
  sortableDragId.value = null;
  sortableOverId.value = null;
}

// ── File drop zone ──
const droppedFiles = ref([]);
const fileZoneOver = ref(false);

function onFileDragOver(transferData, nativeEvent) {
  const types = nativeEvent.dataTransfer.types;
  if (!Array.from(types).includes("Files")) {
    nativeEvent.dataTransfer.dropEffect = "none";
  }
}

function onFileDrop(transferData, nativeEvent) {
  fileZoneOver.value = false;
  const files = Array.from(nativeEvent.dataTransfer.files);
  for (const file of files) {
    const isImage = file.type.startsWith("image/");
    droppedFiles.value.unshift({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type || "unknown",
      accepted: isImage,
    });
  }
}

function fileIcon(type) {
  if (type.startsWith("image/")) return "🖼";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type.includes("pdf"))      return "📄";
  return "📎";
}
</script>

<template>
  <div class="page">
    <!-- Header -->
    <header class="site-header">
      <div class="header-inner">
        <div class="header-brand">
          <span class="brand-name">vue3-drag-drop</span>
          <span class="brand-version">v1.2.0</span>
        </div>
        <p class="header-tagline">Simple, lightweight drag and drop for Vue 3 using the native HTML Drag and Drop API.</p>
        <div class="header-links">
          <a href="https://github.com/TusharJoy/vue3-drag-drop" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">GitHub</a>
          <a href="https://www.npmjs.com/package/vue3-drag-drop" target="_blank" rel="noopener noreferrer" class="btn btn-primary">npm install</a>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="main">

      <!-- Section 1: Kanban Board -->
      <section class="demo-section" id="kanban">
        <div class="section-header">
          <h2>Kanban Board</h2>
          <p class="section-desc">Drag cards between columns. Demonstrates multi-drop-zone state management.</p>
        </div>
        <div class="section-body">
          <div class="kanban-board">
            <div v-for="col in kanbanCols" :key="col.id" class="kanban-col">
              <div class="kanban-col-header" :style="{ borderTopColor: col.color }">
                <span class="kanban-col-label">{{ col.label }}</span>
                <span class="kanban-badge" :style="{ background: col.color }">{{ col.cards.length }}</span>
              </div>
              <Drop
                v-slot="{ transferData }"
                class="drop-zone kanban-drop"
                :class="{ over: transferData }"
                @drop="(droppedCard) => kanbanDrop(col.id, droppedCard)"
              >
                <Drag
                  v-for="card in col.cards"
                  :key="card.id"
                  :transfer-data="card"
                  class="drag-item kanban-card"
                >
                  <span class="kanban-handle">⠿</span>
                  {{ card.text }}
                </Drag>
                <p v-if="col.cards.length === 0 && !transferData" class="empty-hint">Drop cards here</p>
              </Drop>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Sortable List -->
      <section class="demo-section" id="sortable">
        <div class="section-header">
          <h2>Sortable List</h2>
          <p class="section-desc">Drag to reorder items within a single list.</p>
        </div>
        <div class="section-body">
          <div class="sortable-list">
            <Drop
              v-for="item in sortableItems"
              :key="item.id"
              class="drop-zone sortable-drop"
              :class="{ over: sortableOverId === item.id && sortableDragId !== item.id }"
              @dragenter="() => sortableOverId = item.id"
              @dragleave="(_, e) => { if (!e.currentTarget.contains(e.relatedTarget) && sortableOverId === item.id) sortableOverId = null }"
              @drop="() => sortableDrop(item)"
            >
              <Drag
                :transfer-data="item"
                class="drag-item sortable-item"
                :class="{ dragging: sortableDragId === item.id }"
                @dragstart="() => sortableDragStart(item)"
                @dragend="sortableDragEnd"
              >
                <span class="dot" :style="{ background: item.color }"></span>
                {{ item.label }}
                <span class="sortable-handle">↕</span>
              </Drag>
            </Drop>
          </div>
        </div>
      </section>

      <!-- Section 3: File Drop Zone -->
      <section class="demo-section" id="files">
        <div class="section-header">
          <h2>File Drop Zone</h2>
          <p class="section-desc">Drop real files from your OS. Images accepted; other types rejected.</p>
        </div>
        <div class="section-body">
          <Drop
            class="drop-zone file-drop"
            :class="{ over: fileZoneOver }"
            @dragover="onFileDragOver"
            @dragenter="() => fileZoneOver = true"
            @dragleave="(_, e) => { if (!e.currentTarget.contains(e.relatedTarget)) fileZoneOver = false }"
            @drop="onFileDrop"
          >
            <div class="file-drop-inner">
              <span class="file-drop-icon">{{ fileZoneOver ? '📂' : '📁' }}</span>
              <p class="file-drop-label">{{ fileZoneOver ? 'Release to drop' : 'Drop files here' }}</p>
              <p class="file-drop-hint">Images accepted · Other types shown as rejected</p>
            </div>
          </Drop>

          <div v-if="droppedFiles.length" class="file-list">
            <div
              v-for="file in droppedFiles"
              :key="file.id"
              class="file-entry"
              :class="{ rejected: !file.accepted }"
            >
              <span class="file-icon">{{ fileIcon(file.type) }}</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
              <span class="file-status">{{ file.accepted ? '✓ accepted' : '✗ rejected' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Custom Drag Ghost -->
      <section class="demo-section" id="ghost">
        <div class="section-header">
          <h2>Custom Drag Ghost</h2>
          <p class="section-desc">Compare the browser's default drag ghost with a custom HTML ghost via the <code>image</code> slot.</p>
        </div>
        <div class="section-body">
          <!-- Task 5 content goes here -->
        </div>
      </section>

      <!-- Section 5: Toggle Draggable -->
      <section class="demo-section" id="toggle">
        <div class="section-header">
          <h2>Toggle Draggable</h2>
          <p class="section-desc">Enable or disable individual items using the <code>:draggable</code> prop.</p>
        </div>
        <div class="section-body">
          <!-- Task 6 content goes here -->
        </div>
      </section>

      <!-- Section 6: Move vs Clone -->
      <section class="demo-section" id="move-clone">
        <div class="section-header">
          <h2>Move vs Clone</h2>
          <p class="section-desc">Toggle between moving items (removed from source) and cloning them (kept in source).</p>
        </div>
        <div class="section-body">
          <!-- Task 7 content goes here -->
        </div>
      </section>

      <!-- Section 7: Event Log -->
      <section class="demo-section" id="events">
        <div class="section-header">
          <h2>Event Log</h2>
          <p class="section-desc">All 7 drag events fire in real-time. Drag anything on this page to see them.</p>
        </div>
        <div class="section-body">
          <!-- Task 8 content goes here -->
        </div>
      </section>

      <!-- Section 8: Typed Drop Zones -->
      <section class="demo-section" id="typed">
        <div class="section-header">
          <h2>Typed Drop Zones</h2>
          <p class="section-desc">Drop zones that inspect <code>transferData</code> during <code>dragover</code> to accept or reject specific types.</p>
        </div>
        <div class="section-body">
          <!-- Task 9 content goes here -->
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <a href="https://github.com/TusharJoy/vue3-drag-drop" target="_blank" rel="noopener noreferrer">GitHub</a>
      <span>·</span>
      <a href="https://www.npmjs.com/package/vue3-drag-drop" target="_blank" rel="noopener noreferrer">npm</a>
      <span>·</span>
      <span>MIT License</span>
    </footer>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  line-height: 1.5;
}

/* ── Page layout ── */
.page { min-height: 100vh; display: flex; flex-direction: column; }
.main { flex: 1; max-width: 960px; margin: 0 auto; width: 100%; padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 2rem; }

/* ── Header ── */
.site-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
}
.header-inner { max-width: 960px; margin: 0 auto; }
.header-brand { display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.5rem; }
.brand-name { font-size: 1.5rem; font-weight: 800; color: #1e293b; letter-spacing: -0.02em; }
.brand-version { font-size: 0.8rem; font-weight: 600; color: #6366f1; background: #eef2ff; padding: 2px 8px; border-radius: 999px; }
.header-tagline { color: #64748b; font-size: 0.95rem; margin-bottom: 1rem; max-width: 560px; }
.header-links { display: flex; gap: 0.75rem; }

/* ── Buttons ── */
.btn { display: inline-flex; align-items: center; padding: 0.45rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: background 0.15s, color 0.15s; }
.btn-primary { background: #6366f1; color: white; }
.btn-primary:hover { background: #4f46e5; }
.btn-ghost { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.btn-ghost:hover { background: #e2e8f0; }

/* ── Demo sections ── */
.demo-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
}
.section-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}
.section-header h2 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
.section-desc { font-size: 0.85rem; color: #64748b; }
.section-desc code { font-family: monospace; background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-size: 0.8rem; color: #6366f1; }
.section-body { padding: 1.5rem; }

/* ── Shared drag primitives ── */
.drag-item {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.6rem 0.875rem; border-radius: 8px;
  background: white; border: 1.5px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  cursor: grab; user-select: none; font-size: 0.9rem; font-weight: 500;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.drag-item:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.1); border-color: #cbd5e1; }
.drag-item:active { cursor: grabbing; }
.drag-item.disabled { opacity: 0.4; cursor: not-allowed; }

.drop-zone {
  min-height: 100px; border-radius: 10px;
  border: 2px dashed #cbd5e1; background: #f8fafc;
  padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem;
  transition: border-color 0.15s, background 0.15s;
}
.drop-zone.over { border-color: #6366f1; background: #eef2ff; }
.drop-zone.over-valid { border-color: #22c55e; background: #f0fdf4; }
.drop-zone.over-invalid { border-color: #ef4444; background: #fef2f2; }

.empty-hint { color: #94a3b8; font-size: 0.875rem; text-align: center; margin: auto; }
.drag-hint { font-size: 0.875rem; font-weight: 600; text-align: center; margin: auto; }
.drop-zone.over-valid .drag-hint { color: #16a34a; }
.drop-zone.over-invalid .drag-hint { color: #dc2626; }

.dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

.drag-ghost {
  padding: 6px 14px; border-radius: 8px;
  color: white; font-weight: 700; font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* ── Kanban ── */
.kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
@media (max-width: 600px) { .kanban-board { grid-template-columns: 1fr; } }
.kanban-col-header { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem; border-top: 3px solid; border-radius: 8px 8px 0 0; background: #f8fafc; margin-bottom: 0.5rem; }
.kanban-col-label { font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
.kanban-badge { color: white; font-size: 0.7rem; font-weight: 700; padding: 1px 7px; border-radius: 999px; }
.kanban-drop { min-height: 200px; }
.kanban-card { margin-bottom: 0.25rem; }
.kanban-handle { color: #cbd5e1; font-size: 1rem; cursor: grab; }

/* ── Footer ── */
.site-footer {
  text-align: center; padding: 1.5rem;
  font-size: 0.8rem; color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  display: flex; justify-content: center; gap: 0.75rem;
}
.site-footer a { color: #64748b; text-decoration: none; }
.site-footer a:hover { color: #6366f1; }

/* ── Sortable list ── */
.sortable-list { display: flex; flex-direction: column; gap: 0; max-width: 400px; }
.sortable-drop { min-height: unset; padding: 0.25rem 0; border: none; background: transparent; border-radius: 0; }
.sortable-drop.over { border: none; background: transparent; }
.sortable-drop.over .sortable-item { transform: translateY(2px); }
.sortable-item { width: 100%; justify-content: flex-start; }
.sortable-item.dragging { opacity: 0.4; }
.sortable-handle { margin-left: auto; color: #cbd5e1; font-size: 1rem; }

/* ── File drop zone ── */
.file-drop { min-height: 140px; justify-content: center; align-items: center; cursor: pointer; }
.file-drop.over { border-color: #6366f1; background: #eef2ff; }
.file-drop-inner { text-align: center; }
.file-drop-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.file-drop-label { font-weight: 600; color: #475569; margin-bottom: 0.25rem; }
.file-drop-hint { font-size: 0.8rem; color: #94a3b8; }
.file-list { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; }
.file-entry { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 0.875rem; }
.file-entry.rejected { background: #fef2f2; border-color: #fecaca; }
.file-icon { font-size: 1.1rem; }
.file-name { font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-size { color: #64748b; font-size: 0.8rem; }
.file-status { font-size: 0.75rem; font-weight: 700; color: #16a34a; }
.file-entry.rejected .file-status { color: #dc2626; }
</style>
