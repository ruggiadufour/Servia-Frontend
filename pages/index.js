import Meta from "../Components/Meta";
import Home from "../Components/Home/Home";
import HomeScreen from "../Components/Home/HomeScreen";
import Extra from "../Components/Home/Extra";
import { getCategories } from "../Api/categories";

export default function Home_container({ categories }) {
  return (
    <>
      <Meta
        title="Servia - Encuentra tu servicio ideal"
        desc="Servia es un sitio web en donde podrás encontrar proveedores de servicios, podrás contactarlos y disfrutar de sus servicios. Los proveedores de servicios puede crear sus perfiles y promocionarse gratuitamente en Servia."
        canonical={`https://servia.ar`}
        keywords={`Servia, servicios domésticos, proveedor de srevicios, publicaciones, promocion de servicios`}
      />

      <main className="flex-col">
        <HomeScreen />
        <Home categories={categories} />
        <Extra />
      </main>
    </>
  );
}

export async function getStaticProps() {
  const data = await getCategories();
  return {
    props: {
      categories: data,
    },
  };
}
