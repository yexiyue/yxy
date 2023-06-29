import path from "path";
import { fileURLToPath } from "url";

export function getDirnameAndFilename(str:string) {
    const filename=fileURLToPath(import.meta.url);
    return {
        filename,
        dirname:path.dirname(filename)
    }
}