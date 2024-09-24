import axios from "axios";
import { useEffect, useState } from "react";
export const AddContactsPath = "/add/contacts/";
export const AddContacts = () => {
  const [contacts, setContacts] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const init = async () => {
    setContacts(await getContacts());
    setUsers(await getUsers());
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  const getUsers = async () => {
    const response = await axios("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return Object.keys(response.data);
  };
  const saveContact = async (addsId: string) => {
    await axios("http://localhost:3000/user/add/contacts", {
      method: "POST",
      data: JSON.stringify({
        whoAdded: addsId,
        whoAdds: localStorage.getItem("authUserName"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const getContacts = async (): Promise<string[]> => {
    const response = await axios("http://localhost:3000/user/get/contacts", {
      method: "POST",
      data: JSON.stringify({ id: localStorage.getItem("authUserName") }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };
  return (
    <div>
      {loading ? (
        <>LOADING</>
      ) : (
        <>
          {users.map((el) => (
            <div onClick={() => saveContact(el).then(() => init())}>
              <div>{el}</div>
              <div>is added contact: {String(contacts.includes(el))}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
