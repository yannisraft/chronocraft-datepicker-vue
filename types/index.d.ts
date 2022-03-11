import { DefineComponent, Plugin } from "vue";

declare const ChronoCraftVu3Library: Exclude<Plugin["install"], undefined>;

export default ChronoCraftVu3Library;

export const DatePicker: Exclude<Plugin["install"], undefined> | DefineComponent;
export const DateRangePicker: Exclude<Plugin["install"], undefined> | DefineComponent;
