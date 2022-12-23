import Drag from "@/components/Drag.vue";
import Drop from "@/components/Drop.vue";

const SimpleDragDrop = {
  install(Vue) {
    Vue.component("drag", Drag);
    Vue.component("drop", Drop);
  },
};

export { Drag, Drop };

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(SimpleDragDrop);
}

export default SimpleDragDrop;
