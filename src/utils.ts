import fs from "node:fs";
import path from "path";
import xml2js from "xml2js";
import chalk from "chalk";
import { createCanvas, loadImage } from "canvas";

export default async function unpack(
    outputDir: string,
    imagePath: string,
    xmlPath: string,
) {
    try {
        // Ensure output folder exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Read and parse Starling XML
        const xmlData = fs.readFileSync(xmlPath, "utf-8");
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);

        const subTextures = result.TextureAtlas.SubTexture;
        if (!subTextures) {
            console.error(
                chalk.red.bold("Error: No SubTextures found in XML."),
            );
            return;
        }

        // Load the base spritesheet image
        const image = await loadImage(imagePath);

        console.log(
            chalk.magenta.bold(`Processing ${subTextures.length} textures...`),
        );

        // Loop through each subtexture definition
        for (const sub of subTextures) {
            const attr = sub.$;
            const baseName = path.basename(attr.name, path.extname(attr.name));
            const name = `${baseName}.png`;

            const x = parseInt(attr.x, 10);
            const y = parseInt(attr.y, 10);
            const w = parseInt(attr.width, 10);
            const h = parseInt(attr.height, 10);

            // Create target slice canvas
            const canvas = createCanvas(w, h);
            const ctx = canvas.getContext("2d");

            // Draw specific cropped portion
            ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

            // Handle nested sprite folders if they exist in the name string
            const finalPath = path.join(outputDir, name);
            const targetFolder = path.dirname(finalPath);
            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, { recursive: true });
            }

            // Save individual slice out to file system
            const buffer = canvas.toBuffer("image/png");
            fs.writeFileSync(finalPath, buffer);
            console.log(chalk.magenta.bold(`Extracted: ${name}`));
        }

        console.log(chalk.magenta.bold("Unpacking complete!"));
    } catch (err) {
        if (err instanceof Error) {
            console.error(
                chalk.red.bold(
                    `An error occurred during execution: ${err.message}`,
                ),
            );
        }
    }
}
