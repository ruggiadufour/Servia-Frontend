import Head from "next/head";
import VerifyIdentity from "../../Components/ServiceProvider/VerifyIdentity";
export default function Verify() {
  return (
    <>
      <Head>
        <title>Verificar mi identidad</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <VerifyIdentity />
    </>
  );
}
