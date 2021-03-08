import Meta from '../Components/Meta'
import Faq from "../Components/Footer/Faq";
export default function FAQ() {
  return (
    <>
      <Meta
        title="Preguntas frecuentes"
        desc="Conocé todo lo que podés hacer en servia."
        canonical={`https://servia.ar/preguntas-frecuentes`}
        keywords={`preguntas frecuentes, preguntas comunes, saber mas, faq, pf`}
      />
      <Faq />
    </>
  );
}
