export async function checkQdrant(url: string) {
  const target = new URL('/readyz', url).toString();
  const res = await fetch(target);
  return res.ok;
}
