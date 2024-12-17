"use strict";

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import screeps from 'rollup-plugin-screeps';
import file from "./.screeps.json" with { type: "json" };

const dest = process.env.DEST;
if (!dest) {
    console.log("No destination specified - code will be compiled but not uploaded");
} else if ((file[dest]) == null) {
    throw new Error("Invalid upload destination");
}

export default {
    input: "src/main.js",
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true
    },

    plugins: [
        clear({ targets: ["dist"] }),
        resolve({ rootDir: "src" }),
        commonjs(),
        screeps({config: file["main"], dryRun: file["main"] == null})
    ]
}
