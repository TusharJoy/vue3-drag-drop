import type { DefineComponent, Plugin } from 'vue';

export type EffectAllowed =
  | 'none'
  | 'copy'
  | 'copyLink'
  | 'copyMove'
  | 'link'
  | 'linkMove'
  | 'move'
  | 'all'
  | 'uninitialized';

export interface DragProps<T = any> {
  /**
   * Whether the element is draggable.
   * @default true
   */
  draggable?: boolean;

  /**
   * Arbitrary data to pass to the drop target.
   * Accepts any JavaScript primitive, object, or array.
   */
  transferData?: T;

  /**
   * Permitted drag operation effect.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
   */
  effectAllowed?: EffectAllowed;

  /**
   * URL for a custom drag preview image.
   */
  image?: string;

  /**
   * X offset for custom drag image anchor point.
   * @default 0
   */
  imageXOffset?: number;

  /**
   * Y offset for custom drag image anchor point.
   * @default 0
   */
  imageYOffset?: number;

  /**
   * Whether to position slot="image" off-screen so it only appears as the drag ghost.
   * @default true
   */
  hideImageHtml?: boolean;

  /**
   * HTML tag or Vue component to render as the root element.
   * @default "div"
   */
  tag?: string;
}

export interface DragEvents<T = any> {
  drag: (data: T, event: DragEvent) => void;
  dragstart: (data: T, event: DragEvent) => void;
  dragenter: (data: T, event: DragEvent) => void;
  dragleave: (data: T, event: DragEvent) => void;
  dragend: (data: T, event: DragEvent) => void;
}

export interface DropProps {
  /**
   * HTML tag or Vue component to render as the root element.
   * @default "div"
   */
  tag?: string;

  /**
   * CSS class(es) to automatically apply when a dragged item hovers over the drop target.
   * @default ""
   */
  activeClass?: string;
}

export interface DropEvents<T = any> {
  dragenter: (data: T, event: DragEvent) => void;
  dragleave: (data: T, event: DragEvent) => void;
  dragover: (data: T, event: DragEvent) => void;
  drop: (data: T, event: DragEvent) => void;
}

/**
 * Drag wrapper component to make any element draggable.
 */
export declare const Drag: DefineComponent<
  DragProps,
  {},
  {},
  {},
  {},
  {},
  {},
  DragEvents
>;

/**
 * Drop target component to receive dragged items.
 */
export declare const Drop: DefineComponent<
  DropProps,
  {},
  {},
  {},
  {},
  {},
  {},
  DropEvents
>;

declare const SimpleDragDrop: Plugin;
export default SimpleDragDrop;
