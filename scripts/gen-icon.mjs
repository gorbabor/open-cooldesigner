import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SIZE = 32;
const BG = [0xe5, 0x46, 0x4f, 0xff]; // indigo #4f46e5 en BGRA
const FG = [0xff, 0xff, 0xff, 0xff]; // blanc

const pixels = new Uint8Array(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const i = (y * SIZE + x) * 4;
    pixels.set(BG, i);
  }
}

function rect(x0, y0, x1, y1) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * SIZE + x) * 4;
      pixels.set(FG, i);
    }
  }
}

rect(6, 6, 10, 25); // barre gauche du O
rect(21, 6, 25, 25); // barre droite du O
rect(6, 6, 25, 10); // barre haute du O
rect(6, 21, 25, 25); // barre basse du O
rect(14, 12, 18, 16); // centre du O (trou)

// BITMAPINFOHEADER + pixels BGRA + AND mask
const bmpHeader = Buffer.alloc(40);
bmpHeader.writeUInt32LE(40, 0);
bmpHeader.writeInt32LE(SIZE, 4);
bmpHeader.writeInt32LE(SIZE * 2, 8); // hauteur double (AND mask)
bmpHeader.writeUInt16LE(1, 12); // planes
bmpHeader.writeUInt16LE(32, 14); // bpp
const andMask = Buffer.alloc((SIZE * SIZE) / 8, 0);
const image = Buffer.concat([bmpHeader, Buffer.from(pixels), andMask]);

const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0);
dir.writeUInt16LE(1, 2);
dir.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry.writeUInt8(SIZE, 0);
entry.writeUInt8(SIZE, 1);
entry.writeUInt8(0, 2);
entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bitcount
entry.writeUInt32LE(image.length, 8);
entry.writeUInt32LE(22, 12); // offset

const ico = Buffer.concat([dir, entry, image]);
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src-tauri", "icons");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "icon.ico"), ico);
console.log(`icon.ico généré (${ico.length} octets) dans ${outDir}`);
