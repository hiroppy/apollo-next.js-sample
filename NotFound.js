import Error from 'next/error';

export default () => {
  if (process.browser) return <Error statusCode={404} />;

  const e = new Error();
  e.code = 'ENOENT';
  throw e;
}