import { Post } from "../generated/schema";

const posts = [
  {
    id: "p1",
    text: "this is post content p1",
    writerId: "w1",
  },
  {
    id: "p2",
    text: "this is post content p2",
    writerId: "w1",
  },
];

export async function postsByWriterId(
  _: unknown,
  input: { writerId: string },
  context: any
): Promise<[Post] | null> {
  console.log(`currentUser ::::  ${JSON.stringify(context.currentUser)}`);
  const results: any = posts.filter((p) => {
    return p.writerId === input.writerId;
  });
  if (results?.length == 0) return null;
  return results;
}
