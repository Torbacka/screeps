"use strict";

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import screeps from 'rollup-plugin-screeps';
import file from "./.screeps.json" with {type: "json"};

const dryRun = process.env.DRY_RUN;
if (dryRun) {
    console.log("DRY_RUN specified - code will be compiled but not uploaded");
}

export default {
    input: "src/main.js",
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true
    },

    plugins: [
        clear({targets: ["dist"]}),
        resolve({rootDir: "src"}),
        commonjs(),
        screeps({config: file, dryRun: dryRun})
    ]
}
