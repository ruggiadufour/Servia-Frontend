import Head from "next/head";
import ChatComponent from "../../Components/Chat/Chat";
import "../../styles/Chat.module.css";
export default function Chat() {
  return (
    <>
      <Head>
        <title>Chats</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ChatComponent />
    </>
  );
}
