import Head from "next/head";
import Home from "../Components/Home/Home";
import HomeScreen from "../Components/Home/HomeScreen";
import Extra from "../Components/Home/Extra";
import { getCategories } from "../Api/categories";
export default function Home_container({ categories }) {
  return (
    <>
      <Head>
        <title>Servia - Encuentra tu servicio ideal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-col">
        <HomeScreen />
        <Home categories={categories} />
        <Extra />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const data = await getCategories();
  return {
    props: {
      categories: data,
    },
  };
}
