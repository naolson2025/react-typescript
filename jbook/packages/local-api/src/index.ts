export const serve = async (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  console.log('serving traffic on port', port);
  console.log('saving/fetching cells from', filename);
  console.log('that file is in dir', dir);
  console.log('proxy enabled?', useProxy);
};
