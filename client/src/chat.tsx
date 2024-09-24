import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export interface IMessage {
  date: number;
  message: string;
  toWhom: string;
  from: string;
}
export const ChatScreenPath = "/chat";
export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const { id } = useParams();

  const getMessages = async (messagesFrom: string) => {
    return (
      await axios("http://localhost:3000/user/get/messages", {
        method: "POST",
        data: JSON.stringify({
          id: messagesFrom,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).data;
  };
  const init = async () => {
    if (id) setMessages(await getMessages(id));
  };
  const sendMessage = async (message: IMessage) =>
    (
      await axios("http://localhost:3000/user/send/messages", {
        method: "POST",
        data: JSON.stringify(message),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).data;
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={async () => (
            await sendMessage({
              date: Date.now(),
              from: id ?? "",
              message: input,
              toWhom: localStorage.getItem("authUserName") ?? "",
            }),
            await init()
          )}
        >
          Send
        </button>
      </div>
    </div>
  );
};
