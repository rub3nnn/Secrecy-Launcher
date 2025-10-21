// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "C:\\Users\\RUBEN\\Desktop\\Proyectos\\Secrecy-Launcher-V2";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [react(), externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@": resolve(__electron_vite_injected_dirname, "src/")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
