import { createBrowserRouter, useNavigate } from "react-router-dom";
import { ChatScreenPath, Chat } from "./chat";
import { AuthScreen, AuthScreenPath } from "./auth";
import { useEffect, useState } from "react";
import { AddContactsPath, AddContacts } from "./add_contacts";
import { ContactListPagePath, ContactListPage } from "./contact_list_page";

interface IRouter {
  path: string;
  element: React.ReactNode;
  isPrivate: boolean;
}

export const redirectPage = AuthScreenPath;

export const routers: IRouter[] = [
  { path: AuthScreenPath, element: <AuthScreen />, isPrivate: false },
  { path: ChatScreenPath + "/:id", element: <Chat />, isPrivate: true },
  { path: "*", element: <AuthScreen />, isPrivate: false },
  { path: AddContactsPath, element: <AddContacts />, isPrivate: true },
  { path: ContactListPagePath, element: <ContactListPage />, isPrivate: true },
];

export const PrivateRouter: React.FC<{ child: React.ReactNode }> = ({
  child,
}) => {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    if (isAuth === null) {
      navigate(redirectPage);
    } else {
      setRender(true);
    }
  }, []);

  return <>{render ? child : null}</>;
};

export const router = createBrowserRouter(
  routers.map((el) => {
    if (el.isPrivate) {
      el.element = <PrivateRouter child={el.element} />;
    }
    return el;
  })
);
