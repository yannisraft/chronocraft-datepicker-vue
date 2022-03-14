import { DefineComponent, Plugin } from "vue";

declare const ChronoCraftDatePicker: Exclude<Plugin["install"], undefined>;

export default ChronoCraftDatePicker;

export const DatePicker: Exclude<Plugin["install"], undefined> | DefineComponent;
