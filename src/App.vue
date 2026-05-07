<script setup>
import { ref } from "vue";
import { Drag, Drop } from "./components/index";

const items = ref([
  { id: 1, label: "Apple", type: "fruit", color: "#ef4444" },
  { id: 2, label: "Banana", type: "fruit", color: "#eab308" },
  { id: 3, label: "Carrot", type: "vegetable", color: "#f97316" },
  { id: 4, label: "Broccoli", type: "vegetable", color: "#22c55e" },
  { id: 5, label: "Report.pdf", type: "file", color: "#6366f1" },
]);

const fruitBasket = ref([]);
const vegBasket = ref([]);
const lastDropped = ref(null);

function dropOnFruits(data) {
  if (data.type === "fruit" && !fruitBasket.value.find((i) => i.id === data.id)) {
    fruitBasket.value.push(data);
    lastDropped.value = `Added ${data.label} to fruit basket`;
  } else if (data.type !== "fruit") {
    lastDropped.value = `Rejected: ${data.label} is not a fruit`;
  }
}

function dropOnVeggies(data) {
  if (data.type === "vegetable" && !vegBasket.value.find((i) => i.id === data.id)) {
    vegBasket.value.push(data);
    lastDropped.value = `Added ${data.label} to veggie basket`;
  } else if (data.type !== "vegetable") {
    lastDropped.value = `Rejected: ${data.label} is not a vegetable`;
  }
}

function guardFruits(data, nativeEvent) {
  if (data?.type !== "fruit") nativeEvent.dataTransfer.dropEffect = "none";
}

function guardVeggies(data, nativeEvent) {
  if (data?.type !== "vegetable") nativeEvent.dataTransfer.dropEffect = "none";
}
</script>

<template>
  <div class="app">
    <h1>vue3-drag-drop demo</h1>
    <p class="subtitle">Drag items into the correct basket. Files are rejected by both.</p>

    <div class="layout">
      <!-- Draggable items -->
      <section class="panel">
        <h2>Items</h2>
        <div class="item-list">
          <Drag
            v-for="item in items"
            :key="item.id"
            :transfer-data="item"
            class="drag-item"
            :style="{ borderColor: item.color }"
          >
            <span class="dot" :style="{ background: item.color }"></span>
            {{ item.label }}
            <span class="type-badge">{{ item.type }}</span>
            <template v-slot:image>
              <div class="drag-ghost" :style="{ background: item.color }">
                {{ item.label }}
              </div>
            </template>
          </Drag>
        </div>
      </section>

      <!-- Fruit basket -->
      <section class="panel">
        <h2>Fruit Basket</h2>
        <Drop
          v-slot="{ transferData }"
          class="drop-zone"
          :class="{
            'over-valid': transferData?.type === 'fruit',
            'over-invalid': transferData && transferData.type !== 'fruit',
          }"
          @dragover="guardFruits"
          @drop="dropOnFruits"
        >
          <!-- Always visible: shows drag-over feedback even after items are present -->
          <p v-if="transferData" class="drag-hint">
            {{ transferData.type === 'fruit' ? '✓ Drop it!' : '✗ Fruits only' }}
          </p>
          <p v-else-if="fruitBasket.length === 0" class="empty-hint">Drop fruits here</p>
          <div
            v-for="item in fruitBasket"
            :key="item.id"
            class="basket-item"
            :style="{ borderColor: item.color }"
          >
            <span class="dot" :style="{ background: item.color }"></span>
            {{ item.label }}
          </div>
        </Drop>
      </section>

      <!-- Veggie basket -->
      <section class="panel">
        <h2>Veggie Basket</h2>
        <Drop
          v-slot="{ transferData }"
          class="drop-zone"
          :class="{
            'over-valid': transferData?.type === 'vegetable',
            'over-invalid': transferData && transferData.type !== 'vegetable',
          }"
          @dragover="guardVeggies"
          @drop="dropOnVeggies"
        >
          <p v-if="transferData" class="drag-hint">
            {{ transferData.type === 'vegetable' ? '✓ Drop it!' : '✗ Veggies only' }}
          </p>
          <p v-else-if="vegBasket.length === 0" class="empty-hint">Drop veggies here</p>
          <div
            v-for="item in vegBasket"
            :key="item.id"
            class="basket-item"
            :style="{ borderColor: item.color }"
          >
            <span class="dot" :style="{ background: item.color }"></span>
            {{ item.label }}
          </div>
        </Drop>
      </section>
    </div>

    <!-- Status log -->
    <p v-if="lastDropped" class="status">{{ lastDropped }}</p>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f8fafc; color: #1e293b; }

.app { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
.subtitle { color: #64748b; margin-bottom: 2rem; }

.layout { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }

.panel h2 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }

.item-list { display: flex; flex-direction: column; gap: 0.5rem; }

.drag-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 0.75rem; border-radius: 8px;
  border: 2px solid transparent; background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: grab; user-select: none;
}
.drag-item:active { cursor: grabbing; }

.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.type-badge {
  margin-left: auto; font-size: 0.7rem; font-weight: 500;
  padding: 2px 6px; border-radius: 999px;
  background: #f1f5f9; color: #64748b;
}

.drop-zone {
  min-height: 180px; border-radius: 10px; border: 2px dashed #cbd5e1;
  background: white; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.5rem;
  transition: border-color 0.15s, background 0.15s;
}
.drop-zone.over-valid { border-color: #22c55e; background: #f0fdf4; }
.drop-zone.over-invalid { border-color: #ef4444; background: #fef2f2; }

.empty-hint { color: #94a3b8; font-size: 0.9rem; text-align: center; margin: auto; }
.drag-hint { font-size: 0.9rem; font-weight: 600; text-align: center; margin: auto; }
.drop-zone.over-valid .drag-hint { color: #16a34a; }
.drop-zone.over-invalid .drag-hint { color: #dc2626; }

.basket-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.75rem; border-radius: 6px;
  border: 2px solid transparent; background: #f8fafc;
}

.drag-ghost {
  padding: 6px 12px; border-radius: 6px;
  color: white; font-weight: 600; font-size: 0.875rem;
}

.status {
  margin-top: 1.5rem; padding: 0.75rem 1rem; border-radius: 8px;
  background: #f1f5f9; color: #475569; font-size: 0.9rem;
  border-left: 3px solid #6366f1;
}
</style>
