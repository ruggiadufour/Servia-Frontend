import ManageReports from "../../Components/Admin/ManageReports";
import Head from 'next/head'
export default function Manage() {
  return (
    <>
      <Head>
        <title>Gestionar Reportes</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ManageReports />
    </>
  );
}
