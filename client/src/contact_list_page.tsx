import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatScreenPath } from "./chat";

export const ContactListPagePath = "/contact/list/page";
export const ContactListPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<string[]>([]);
  const getMessages = async () => {
    const response = await axios("http://localhost:3000/user/get/contacts", {
      method: "POST",
      data: {
        id: localStorage.getItem("authUserName"),
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data as string[];
  };
  const init = async () => {
    setChats(await getMessages());
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      {chats.map((el) => (
        <div onClick={() => navigate(ChatScreenPath + "/" + el)}>{el}</div>
      ))}
    </div>
  );
};
