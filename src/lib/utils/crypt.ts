import { compare, genSalt, hash } from 'bcrypt-ts';

export async function generateSalt(rounds: number = 10) {
  return await genSalt(rounds) + 'sotee';
}

export async function createHash(text: string) {
  const salt = await generateSalt();
  return await hash(text, salt);
}

export async function compareHash(text: string, hash: string) {
  return await compare(text, hash);
}
