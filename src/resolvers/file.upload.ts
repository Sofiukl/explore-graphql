import { File } from "../generated/schema";
import { finished } from "stream/promises";

export async function singleUpload(
  _: any,
  input: { file: any }
): Promise<File> {
  const { createReadStream, filename, mimetype, encoding } = await input.file;
  const stream = createReadStream();
  const out = require("fs").createWriteStream("local-file-output.txt");
  stream.pipe(out);
  await finished(out);

  return { filename, mimetype, encoding };
}
