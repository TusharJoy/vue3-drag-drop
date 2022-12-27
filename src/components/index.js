import Drag from "./Drag.vue";
import Drop from "./Drop.vue";

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
