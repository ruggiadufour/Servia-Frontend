import Head from 'next/head'
import CreatePR from "../../../Components/Publication/Create-P-R";
import { getPublication } from "../../../Api/publications";
export default function ModifyPublication({ publication }) {
  return (
    <>
      <Head>
        <title>{`Modificar ${publication.title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CreatePR type={true} modify={true} publicationModify={publication} />
    </>
  );
}
export async function getServerSideProps({ params }) {
  const data = await getPublication(params.id);
  return {
    props: {
      publication: data,
    },
  };
}
