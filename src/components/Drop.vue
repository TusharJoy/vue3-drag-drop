<template>
  <component
    :is="tag"
    @dragenter="emitEvent(events.dragenter, $event)"
    @dragleave="emitEvent(events.dragleave, $event)"
    @dragover.prevent="emitEvent(events.dragover, $event)"
    @drop.prevent="emitEvent(events.drop, $event)"
  >
    <slot :transfer-data="scopedData"></slot>
  </component>
</template>

<script>
import transferDataStore from "../helpers/transferDataStore";
import { events } from "../helpers/constants";

export default {
  data() {
    return { transferData: undefined, isDraggingOver: false, insideElements: new Set() };
  },
  props: {
    tag: { type: String, default: "div" },
  },
  emits: events,
  computed: {
    events: () => events,
    scopedData() {
      return this.isDraggingOver && this.transferData;
    },
  },
  methods: {
    emitEvent(name, nativeEvent) {
      this.transferData = transferDataStore.data;
      this.$emit(name, this.transferData, nativeEvent);
      /**
       * After emitting the event, we need to determine if we're still
       * dragging inside this Drop. We keep a Set of all elements that we've
       * dragged into, then clear the data if that set is empty.
       */
      // Add to the set on dragenter.
      if (name === events.dragenter) {
        if (this.insideElements.size || nativeEvent.target === this.$el) {
          this.insideElements.add(nativeEvent.target);
        }
      }
      // Remove from the set on dragleave.
      if (name === events.dragleave) {
        this.insideElements.delete(nativeEvent.target);
      }
      // A drop resets everything.
      if (name === events.drop) {
        this.insideElements.clear();
      }
      // Finally, since Vue can't react to Set changes, set a flag indicating drag status.
      this.isDraggingOver = Boolean(this.insideElements.size);
    },
  },
};
</script>
