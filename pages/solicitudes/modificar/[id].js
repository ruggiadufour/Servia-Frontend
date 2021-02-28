import CreatePR from "../../../Components/Publication/Create-P-R";
import { getPublication } from "../../../Api/publications";
export default function ModifyRequest({ publication }) {
  return (
    <>
      <CreatePR type={false} modify={true} publicationModify={publication} />
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
