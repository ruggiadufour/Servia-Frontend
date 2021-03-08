import Head from 'next/head'
import NotificationsComponent from "../Components/Notifications/Notifications";

export default function Notifications() {
  return (
    <>
      <Head>
        <title>Notificaciones</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NotificationsComponent />
    </>
  );
}
