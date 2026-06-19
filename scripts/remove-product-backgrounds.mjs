import { removeBackground } from "@imgly/background-removal-node";
import fs from "node:fs";
import path from "node:path";

const roots = ["public/products", "public/categories"];

const files = roots.flatMap((root) =>
  fs
    .readdirSync(root)
    .filter((name) => name.endsWith(".png"))
    .map((name) => path.join(root, name)),
);

async function processFile(filePath) {
  const input = fs.readFileSync(filePath);
  const blobInput = new Blob([input], { type: "image/png" });
  const blob = await removeBackground(blobInput, {
    model: "medium",
    output: {
      format: "image/webp",
      quality: 0.92,
      type: "foreground",
    },
  });

  const webpPath = filePath.replace(/\.png$/, ".webp");
  fs.writeFileSync(webpPath, Buffer.from(await blob.arrayBuffer()));
  fs.unlinkSync(filePath);
  console.log(`✓ ${webpPath}`);
}

for (const file of files) {
  await processFile(file);
}

console.log(`Processed ${files.length} images.`);
