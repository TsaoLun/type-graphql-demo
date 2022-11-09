export async function delay(sec: number) {
  return await new Promise((res, _) => {
    setTimeout(() => {
      res(true);
    }, 1000 * sec);
  });
}
