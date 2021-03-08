import Head from "next/head";
import CreatePR from "../../Components/Publication/Create-P-R";

export default function CreateRequest() {
  return (
    <>
      <Head>
        <title>Crear solicitud de servicio</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CreatePR type={false} />
    </>
  );
}
