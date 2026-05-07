<template>
  <component
    :is="tag"
    :draggable="draggable"
    @drag="emitEvent(events.drag, $event)"
    @dragstart="emitEvent(events.dragstart, $event)"
    @dragenter="emitEvent(events.dragenter, $event)"
    @dragleave="emitEvent(events.dragleave, $event)"
    @dragend="emitEvent(events.dragend, $event)"
  >
    <slot :transfer-data="scopedData"></slot>
    <div v-if="hideImageHtml" ref="imageSlotWrapper" :style="hideImageStyle">
      <slot name="image" :transfer-data="scopedData"></slot>
    </div>
    <slot v-else name="image" :transfer-data="scopedData"></slot>
  </component>
</template>

<script>
import transferDataStore from "../helpers/transferDataStore";
import { effectsAllowed, events } from "../helpers/constants";
export default {
  props: {
    draggable: { type: Boolean, default: true },
    transferData: {},
    effectAllowed: { validator: (value) => value in effectsAllowed },
    image: String,
    imageXOffset: { type: Number, default: 0 },
    imageYOffset: { type: Number, default: 0 },
    hideImageHtml: { type: Boolean, default: true },
    tag: { type: String, default: "div" },
  },
  emits: events,
  data() {
    return { dragging: false };
  },
  computed: {
    events: () => events,
    scopedData() {
      return this.dragging && this.transferData;
    },
    hideImageStyle: () => ({ position: "fixed", top: "-1000px" }),
  },
  methods: {
    emitEvent(name, nativeEvent) {
      const transfer = nativeEvent.dataTransfer;
      if (name === events.dragstart) {
        if (this.effectAllowed) {
          transfer.effectAllowed = this.effectAllowed;
        }
        if (this.image) {
          const img = new Image();
          img.src = this.image;
          if (transfer.setDragImage) {
            transfer.setDragImage(img, this.imageXOffset, this.imageYOffset);
          }
        } else if (this.$slots.image && this.$refs.imageSlotWrapper) {
          const el = this.$refs.imageSlotWrapper.firstElementChild;
          if (el && transfer.setDragImage) {
            transfer.setDragImage(el, this.imageXOffset, this.imageYOffset);
          }
        }
        if (this.transferData !== undefined) {
          transferDataStore.data = this.transferData;
          nativeEvent.dataTransfer.setData("text", "");
        }
        this.dragging = true;
      }
      this.$emit(name, this.transferData, nativeEvent);
      if (name === events.dragend) {
        transferDataStore.data = undefined;
        this.dragging = false;
      }
    },
  },
};
</script>
