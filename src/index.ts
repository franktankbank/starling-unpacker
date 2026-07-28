#!/usr/bin/env node

import yargs from "yargs";
import chalk from "chalk";
import unpack from "./utils.js";

const usage = chalk.hex("#83aaff")(
    "Usage: starling-unpacker --atlas <atlas.xml> --sprite <sprite.png> --output <output_directory>",
);

const yargsInstance = yargs(process.argv.slice(2));

const parser = yargsInstance
    .wrap(yargsInstance.terminalWidth())
    .usage(usage)
    .help(true)
    .options({
        a: {
            alias: "atlas",
            describe: "XML texture atlas file",
            type: "string",
            demandOption: true,
        },
        s: {
            alias: "sprite",
            describe: "Starling sprite sheet",
            type: "string",
            demandOption: true,
        },
        o: {
            alias: "output",
            describe: "Output directory",
            type: "string",
            demandOption: true,
        },
    });

(async () => {
    const argv = await parser.parse();
    await unpack(argv.o, argv.s, argv.a);
})();
