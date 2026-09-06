# Vue 3 Drag and Drop — `vue3-drag-drop`

> Simple, lightweight, zero-dependency HTML5 drag and drop library for Vue 3 and Nuxt 3.

[![npm version](https://img.shields.io/npm/v/vue3-drag-drop.svg?style=flat-square)](https://www.npmjs.com/package/vue3-drag-drop)
[![npm downloads](https://img.shields.io/npm/dm/vue3-drag-drop.svg?style=flat-square)](https://www.npmjs.com/package/vue3-drag-drop)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vue3-drag-drop?style=flat-square)](https://bundlephobia.com/package/vue3-drag-drop)
[![license](https://img.shields.io/npm/l/vue3-drag-drop.svg?style=flat-square)](https://github.com/TusharJoy/vue3-drag-drop/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/TusharJoy/vue3-drag-drop?style=flat-square)](https://github.com/TusharJoy/vue3-drag-drop)

[**Live Interactive Demo →**](https://tusharjoy.github.io/vue3-drag-drop/) &nbsp;|&nbsp; [**Open in StackBlitz →**](https://stackblitz.com/github/TusharJoy/vue3-drag-drop)

---

## Key Features

- ⚡ **Zero Dependencies & Ultra-lightweight** (< 2 kB gzipped) — a modern, lightweight alternative to heavy libraries like SortableJS and vuedraggable.
- 🎯 **Native HTML5 Drag & Drop API** with consistent, reliable cross-browser behavior.
- 📦 **First-Class Vue 3 & Nuxt 3 Support** — works out-of-the-box with Composition API (`<script setup>`) and Options API.
- 🔄 **Direct Object Transfer** — pass complex JavaScript objects and arrays seamlessly without manual JSON serialization.
- 🖼️ **Custom Drag Images & Ghosts** via slots or image URLs.
- 📱 **Mobile & Touch Compatible** — built-in touch polyfill ensures drag and drop works on touchscreens and mobile devices.

---

## Table of Contents

- [Key Features](#key-features)
- [Why](#why)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
  - [Drag Props](#drag-props)
  - [Events](#events)
  - [Slots](#slots)
- [Examples](#examples)
  - [Basic drag and drop](#basic-drag-and-drop)
  - [Transfer complex data](#transfer-complex-data)
  - [Conditional drop acceptance](#conditional-drop-acceptance)
  - [Custom drag image via slot](#custom-drag-image-via-slot)
  - [Scoped slot — show data on hover](#scoped-slot--show-data-on-hover)
- [Touch Support](#touch-support)
- [Development](#development)
- [License](#license)

---

## Why

The native HTML Drag and Drop API has a few painful quirks:

- Transfer data is **not available** during `dragover` — you can't inspect what's being dragged to decide whether to accept it.
- You must serialize complex data (objects, arrays) to strings yourself.
- Every drop target needs `event.preventDefault()` on `dragover` or drops silently fail.

This package wraps those rough edges so you can focus on your app.

### Comparison: Why choose `vue3-drag-drop`?

| Feature | `vue3-drag-drop` | `vuedraggable` / SortableJS | `@vueuse/gesture` |
|---|---|---|---|
| **Bundle Size (Gzipped)** | **< 2 kB** | ~35 kB | ~15 kB |
| **External Dependencies** | **0 (Zero)** | Multiple | Multiple |
| **API Philosophy** | Declarative `<Drag>` & `<Drop>` components | DOM list reordering wrapper | Low-level gesture hooks |
| **Data Transfer** | Any JS object/array | Array reordering only | Raw pointer coordinates |
| **Vue 3 & Nuxt 3 Native** | ✅ Built specifically for Vue 3 | ⚠️ Vue 3 port of legacy wrapper | ✅ |

---

## Installation

```bash
npm install vue3-drag-drop
```

---

## Quick Start

Register globally in `main.js`:

```js
import { createApp } from "vue";
import App from "./App.vue";
import { Drag, Drop } from "vue3-drag-drop";

const app = createApp(App);
app.component("Drag", Drag);
app.component("Drop", Drop);
app.mount("#app");
```

Or import locally in a component:

```vue
<script setup>
import { Drag, Drop } from "vue3-drag-drop";
</script>
```

---

## API

### Components

#### `<Drag>`

Wraps any content to make it draggable. Renders as a `<div>` by default (override with the `tag` prop).

#### `<Drop>`

A drop target. Accepts any `<Drag>`. Renders as a `<div>` by default.

---

### Drag Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `draggable` | `Boolean` | `true` | Toggle draggability on/off |
| `transfer-data` | `any` | `null` | Data passed to all Drop events |
| `effect-allowed` | `String` | `null` | One of `none copy copyLink copyMove link linkMove move all uninitialized` — see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed) |
| `image` | `String` | `null` | URL for custom drag image |
| `image-x-offset` | `Number` | `0` | X offset for custom drag image anchor |
| `image-y-offset` | `Number` | `0` | Y offset for custom drag image anchor |
| `hide-image-html` | `Boolean` | `true` | Hide off-screen image slot HTML |
| `tag` | `String` | `"div"` | HTML tag for the wrapper element |

### Drop Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tag` | `String` | `"div"` | HTML tag for the wrapper element |
| `active-class` | `String` | `""` | CSS class(es) automatically applied to Drop when dragging over |

---

### Nuxt 3 & TypeScript

`vue3-drag-drop` includes first-class TypeScript types out of the box.

For **Nuxt 3**, register it via a client plugin (`plugins/vue3-drag-drop.client.ts`):

```ts
import { Drag, Drop } from "vue3-drag-drop";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Drag", Drag);
  nuxtApp.vueApp.component("Drop", Drop);
});
```

---

### Events

All events receive the same two arguments:

| Argument | Type | Description |
|---|---|---|
| `transferData` | `any` | The value set on the `<Drag>`'s `transfer-data` prop |
| `nativeEvent` | `DragEvent` | The native browser event |

#### `<Drag>` events

| Event | Fired |
|---|---|
| `dragstart` | Once when drag begins |
| `drag` | Continuously while dragging |
| `dragenter` | When drag enters a Drop |
| `dragleave` | When drag leaves a Drop |
| `dragend` | Once when drag ends (after `drop`) |

#### `<Drop>` events

| Event | Fired |
|---|---|
| `dragenter` | When a Drag enters this target |
| `dragover` | Continuously while a Drag is over this target |
| `dragleave` | When a Drag leaves this target |
| `drop` | When a Drag is dropped here |

---

### Slots

#### Default slot — `<Drag>` and `<Drop>`

Scoped. The scope exposes:
- `transferData`: The current drag's transfer data (available on `<Drag>` while dragging; available on `<Drop>` when an item is dragged over it).
- `isOver` *(on `<Drop>`)*: Boolean flag indicating if a dragged element is currently hovering over this drop target.

```vue
<Drop v-slot="{ transferData, isOver }" active-class="ring-2 ring-indigo-500 bg-indigo-50">
  <div :class="{ highlight: isOver }">
    {{ isOver ? `Dropping: ${transferData?.name}` : "Drop here" }}
  </div>
</Drop>
```

#### `image` slot — `<Drag>` only

Use HTML as a custom drag image instead of the browser default:

```vue
<Drag :transfer-data="item">
  {{ item.label }}
  <template v-slot:image>
    <div class="drag-ghost">{{ item.label }}</div>
  </template>
</Drag>
```

The slot content is rendered off-screen (`position: fixed; top: -1000px`) so it's visible to the browser but not to the user. Set `hide-image-html="false"` to disable this behavior.

---

## Examples

### Basic drag and drop

```vue
<template>
  <Drag :transfer-data="{ id: 1, label: 'Item A' }">
    Drag me
  </Drag>

  <Drop @drop="onDrop">
    Drop here
  </Drop>
</template>

<script setup>
import { Drag, Drop } from "vue3-drag-drop";

function onDrop(transferData, nativeEvent) {
  console.log("Dropped:", transferData); // { id: 1, label: 'Item A' }
}
</script>
```

---

### Transfer complex data

`transfer-data` accepts any JavaScript value — no serialization needed:

```vue
<template>
  <Drag
    v-for="card in cards"
    :key="card.id"
    :transfer-data="card"
  >
    {{ card.title }}
  </Drag>

  <Drop @drop="addCard">
    <div v-for="card in column" :key="card.id">{{ card.title }}</div>
  </Drop>
</template>

<script setup>
import { ref } from "vue";
import { Drag, Drop } from "vue3-drag-drop";

const cards = ref([
  { id: 1, title: "Task 1", priority: "high" },
  { id: 2, title: "Task 2", priority: "low" },
]);
const column = ref([]);

function addCard(card) {
  column.value.push(card);
}
</script>
```

---

### Conditional drop acceptance

Use `transferData` in the Drop's scoped slot to show visual feedback — and inspect it in `dragover` to selectively accept drops:

```vue
<template>
  <Drag :transfer-data="{ type: 'image', url: '...' }">Image file</Drag>
  <Drag :transfer-data="{ type: 'video', url: '...' }">Video file</Drag>

  <Drop
    v-slot="{ transferData }"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div :class="{ accepting: transferData?.type === 'image' }">
      Images only
    </div>
  </Drop>
</template>

<script setup>
import { Drag, Drop } from "vue3-drag-drop";

function onDragOver(transferData, nativeEvent) {
  if (transferData?.type !== "image") {
    nativeEvent.dataTransfer.dropEffect = "none";
  }
}

function onDrop(transferData, nativeEvent) {
  if (transferData?.type === "image") {
    console.log("Accepted image:", transferData.url);
  }
}
</script>
```

---

### Custom drag image via slot

```vue
<template>
  <Drag :transfer-data="item">
    {{ item.name }}
    <template v-slot:image>
      <div class="custom-ghost">
        📦 {{ item.name }}
      </div>
    </template>
  </Drag>
</template>

<script setup>
import { Drag } from "vue3-drag-drop";
const item = { name: "My Item" };
</script>

<style>
.custom-ghost {
  background: #4f46e5;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
</style>
```

---

### Scoped slot — show data on hover

```vue
<template>
  <Drag :transfer-data="{ name: 'Report.pdf', size: '2.4MB' }">
    Report.pdf
  </Drag>

  <Drop v-slot="{ transferData }">
    <div class="dropzone" :class="{ active: transferData }">
      <span v-if="transferData">
        Drop to upload {{ transferData.name }} ({{ transferData.size }})
      </span>
      <span v-else>Drop files here</span>
    </div>
  </Drop>
</template>

<script setup>
import { Drag, Drop } from "vue3-drag-drop";
</script>
```

### Tracking drag lifecycle events

Use `@dragstart` and `@dragend` on `<Drag>` to track when a drag begins and ends. Use `@dragenter` and `@dragleave` on `<Drop>` to react when the drag enters or leaves:

```vue
<template>
  <Drag
    :transfer-data="item"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    {{ item.name }}
  </Drag>

  <Drop
    @dragenter="onEnter"
    @dragleave="onLeave"
    @drop="onDrop"
  >
    <div :class="{ active: isOver }">Drop here</div>
  </Drop>
</template>

<script setup>
import { ref } from "vue";
import { Drag, Drop } from "vue3-drag-drop";

const item = { name: "my-file.txt", size: 1024 };
const isDragging = ref(false);
const isOver = ref(false);

function onDragStart(transferData, nativeEvent) {
  isDragging.value = true;
  console.log("Drag started:", transferData.name);
}

function onDragEnd(transferData, nativeEvent) {
  isDragging.value = false;
  console.log("Drag ended");
}

function onEnter(transferData, nativeEvent) {
  isOver.value = true;
}

function onLeave(transferData, nativeEvent) {
  isOver.value = false;
}

function onDrop(transferData, nativeEvent) {
  isOver.value = false;
  console.log("Dropped:", transferData.name, transferData.size, "bytes");
}
</script>
```

### Moving and cloning between lists

**Move** (item leaves source list):

```vue
<template>
  <div class="list">
    <Drag
      v-for="item in listA"
      :key="item.id"
      :transfer-data="{ item, sourceList: 'A' }"
    >
      {{ item.label }}
    </Drag>
  </div>

  <Drop @drop="moveItem">
    <div v-for="item in listB" :key="item.id">{{ item.label }}</div>
  </Drop>
</template>

<script setup>
import { ref } from "vue";
import { Drag, Drop } from "vue3-drag-drop";

const listA = ref([
  { id: 1, label: "Item 1" },
  { id: 2, label: "Item 2" },
]);
const listB = ref([]);

function moveItem({ item, sourceList }) {
  if (sourceList === "A") {
    listA.value = listA.value.filter((i) => i.id !== item.id);
    listB.value.push(item);
  }
}
</script>
```

**Clone** (item stays in source list):

```vue
<template>
  <div class="list">
    <Drag
      v-for="item in listA"
      :key="item.id"
      :transfer-data="item"
    >
      {{ item.label }}
    </Drag>
  </div>

  <Drop @drop="cloneItem">
    <div v-for="item in listB" :key="item.id">{{ item.label }}</div>
  </Drop>
</template>

<script setup>
import { ref } from "vue";
import { Drag, Drop } from "vue3-drag-drop";

const listA = ref([
  { id: 1, label: "Item 1" },
  { id: 2, label: "Item 2" },
]);
const listB = ref([]);

function cloneItem(item) {
  if (!listB.value.find((i) => i.id === item.id)) {
    listB.value.push({ ...item });
  }
}
</script>
```

---

## Touch Support

Touch drag and drop is supported via a bundled polyfill based on [DragDropTouch](https://github.com/Bernardo-Castilho/DragDropTouch). No configuration needed — it activates automatically in browsers without native drag and drop touch support.

---

## Development

```bash
# Install deps
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build library to dist/
npm run build
```

To test changes in another project locally:

```bash
# In this repo
npm link

# In your other project
npm link vue3-drag-drop
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
