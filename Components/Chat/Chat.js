import React, { useState, Component, useEffect, useContext } from "react";
import Image from 'next/image'

import ChatItem from "./ChatComponents/ChatItem/ChatItem";
import ChatList from "./ChatComponents/ChatList/ChatList";
import MessageList from "./ChatComponents/MessageList/MessageList";
import Input from "./ChatComponents/Input/Input";
import Button from "./ChatComponents/Button/Button";
import SideBar from "./ChatComponents/SideBar/SideBar";


//Material UI
import {
  IconButton,
  Button as Boton,
  LinearProgress as Cargando,
} from "@material-ui/core/";
import Alerta from "@material-ui/lab/Alert";
import {
  KeyboardReturn as Atras,
  StarRate,
  TrackChangesOutlined,
  TramRounded,
} from "@material-ui/icons/";

import { UserState } from "../../States/User";
export function Chat() {
  const { CState, UState, socket } = useContext(UserState);
  const API = process.env.NEXT_PUBLIC_API;
  //Declaramos las viarables que se utilizarán en el componente
  const [atras, setatras] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contentMessage, setContentMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    //if (chats.length === 0)
    setChats(
      CState.map((chat) => {
        let senderUser = false;
        if (UState.user.public_user.id === chat.public_users[0].id) {
          senderUser = true;
        }

        const sender = senderUser ? chat.public_users[0] : chat.public_users[1];
        const receiver = !senderUser
          ? chat.public_users[0]
          : chat.public_users[1];

        return {
          id: chat.id,
          type: chat.type,
          who_start_it: chat.who_start_it,
          avatar: getAvatar(receiver.profile?.url),
          avatarFlexible: true,
          statusColor: "lightgreen",
          statusColorType: "encircle",
          alt: "Imagen de perfil",
          title: `${receiver.name} ${receiver.surname}`,
          date: new Date(chat.messages[chat.messages.length - 1].created_at),
          subtitle: chat.messages[chat.messages.length - 1].content,
          unread: UState.user.public_user.id==chat.who_start_it?chat.noread_sender:chat.noread_receiver,
          messages: [],
          messages_no_ready: chat.messages,
          sender: sender,
          receiver: receiver,
          // noread_sender: chat.noread_sender,
          // noread_receiver: chat.noread_receiver,
          // categoria: chat.categoria,
          // solicitud: chat.solicitud,
          // peticion: chat.peticion,
        };
      })
    );
  }, [CState]);

  function getAvatar(url) {
    if (url) {
      return API + url;
    } else {
      return "/profile.png";
    }
  }

  useEffect(() => {
    if (selectedChat) {
      chats.map((chat) => {
        if (chat.id === selectedChat.id) {
          setCurrentChat(chat);
        }
      });
    }
  }, [chats]);

  function setCurrentChat(chat) {
    let msjs = chat.messages_no_ready.map((message) =>
      getMessageObject(message, chat)
    );
    setSelectedChat(chat);
    setMessages(msjs);

    socket.emit("read-messages",JSON.stringify({id: chat.id, who:UState.user.public_user.id==chat.who_start_it}))
  }

  function sendMessage() {
    if (contentMessage !== "") {
      const { id, receiver, sender } = selectedChat;

      socket.emit(
        "send-message",
        JSON.stringify({
          chat_id: id,
          receiver_id: receiver.id,
          sender_id: sender.id,
          content: contentMessage,
          jwt: UState.jwt,
        })
      );
    }
  }

  return (
    <div className="container-chat">
      <div className="chat-list">
        <SideBar
          top={<div></div>}
          center={
            <ChatList
              className="chat-list"
              onClick={setCurrentChat}
              dataSource={chats}
            />
          }
          bottom={<div></div>}
        />
      </div>
      <IconButton
        style={{
          position: atras ? "relative" : "absolute",
          left: "0px",
          top: "70px",
          zIndex: 100,
        }}
      >
        <Atras />
      </IconButton>
      <div className="right-panel">
        {selectedChat && (
          <ChatItem
            avatar={getAvatar(selectedChat.receiver.profile?.url)}
            alt={"receptor"}
            title={selectedChat.title}
            subtitle={selectedChat.type===0?selectedChat.who_start_it==UState.user.public_user.id?"Sis":"Non":"No"}
            date={null}
            unread={0}
            className="chat-item"
          />
        )}

        {messages.length === 0 && <Image width={300} height={300} layout="intrinsic" src="/IconoV3.png" />}

        {messages.length !== 0 && <MessageList
          className="message-list"
          lockable={true}
          downButtonBadge={10}
          dataSource={messages}
        />}

        {selectedChat && (
          <Input
            placeholder="Escribe tu mensaje."
            defaultValue=""
            onChange={(e) => {
              e.preventDefault();
              setContentMessage(e.target.value);
            }}
            //ref='input'
            multiline={true}
            onKeyPress={(e) => {
              if (e.shiftKey && e.charCode === 13) {
                return true;
              }
              if (e.charCode === 13) {
                sendMessage();
                return false;
              }
            }}
            rightButtons={
              <Button
                color="white"
                backgroundColor="black"
                text="Enviar"
                onClick={sendMessage}
              />
            }
          />
        )}
      </div>
    </div>
  );

  function getMessageObject(message, chat) {
    const isOfSender = message.sent_by == UState.user.public_user.id;
    const sender_name = `${chat.sender.name} ${chat.sender.surname}`;
    const receiver_name = `${chat.receiver.name} ${chat.receiver.surname}`;
    return {
      position: isOfSender ? "right" : "left",
      forwarded: false,
      replyButton: false,
      reply: null,
      meeting: null,
      type: "text",
      theme: "white",
      view: "list",
      title: isOfSender ? sender_name : receiver_name,
      titleColor: "#EB7887",
      text: message.content,
      onLoad: () => {
        console.log("Photo loaded");
      },
      status: null,
      date: new Date(message.created_at),
      onReplyMessageClick: () => {
        console.log("onReplyMessageClick");
      },
      avatar: isOfSender
        ? getAvatar(chat.sender.profile?.url)
        : getAvatar(chat.receiver.profile?.url),
    };
  }
}

export default Chat;
