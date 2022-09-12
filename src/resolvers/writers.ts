import { Writer } from "../generated/schema";

const writers = [
  {
    id: "w1",
    writerEmail: "writerw1@email.com",
  },
  {
    id: "w2",
    writerEmail: "writerw2@email.com",
  },
];

export async function writerById(
  _: unknown,
  input: { id: string },
  context: any
): Promise<Writer | null> {
  console.log(`currentUser ::::  ${JSON.stringify(context.currentUser)}`);
  const results = writers.filter((w) => {
    return w.id === input.id;
  });
  if (results?.length == 0) return null;
  return results[0];
}
