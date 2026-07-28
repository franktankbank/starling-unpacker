import { defineConfig } from "tsdown";

export default defineConfig({
    dts: false,
    entry: {
        unpacker: "./src/index.ts",
    },
    deps: {
        neverBundle: true,
    },
    clean: true,
    nodeProtocol: true,
    outDir: "bin",
    platform: "node",
});
