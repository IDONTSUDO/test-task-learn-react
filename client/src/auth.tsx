import { useState } from "react";
import { Input } from "./input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ContactListPagePath } from "./contact_list_page";
interface IUser {
  username: string;
  password: string;
}
export const AuthScreenPath = "/auth";
export const AuthScreen = () => {
  const [authInput, setAuthInput] = useState<string>("");
  const navigate = useNavigate();

  const [leftIsActive, setActiveLeft] = useState<boolean>(false);
  const switchMenuMode = () => setActiveLeft(!leftIsActive);
  const [authorizationModel, setAuthorizationModel] = useState<IUser>({
    username: "",
    password: "",
  });
  const register = async (user: IUser) => {
    const response = await axios("http://localhost:3000/register", {
      method: "POST",
      data: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    switchMenuMode();
  };
  const login = async (user: IUser) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw new Error("");
    } else {
      localStorage.setItem("isAuth", "auth");
      localStorage.setItem("authUserName", user.username);

      navigate(ContactListPagePath);
    }
  };
  return (
    <>
      {leftIsActive ? (
        <>
          <div onClick={() => switchMenuMode()}>LOGIN</div>
          <input
            value={authInput}
            type="text"
            onChange={(e) => {
              setAuthInput(e.target.value);
            }}
          />
          <Input
            onChange={(text: string) =>
              setAuthorizationModel(
                Object.assign(authorizationModel, { username: text })
              )
            }
            name={"username"}
          />
          <Input
            onChange={(text: string) =>
              setAuthorizationModel(
                Object.assign(authorizationModel, { password: text })
              )
            }
            name={"Password"}
          />
          <button
            onClick={() => {
              login(authorizationModel);
            }}
          >
            OK
          </button>
        </>
      ) : (
        <>
          <div onClick={() => switchMenuMode()}>REGISTER</div>
          <Input
            onChange={(text: string) =>
              setAuthorizationModel(
                Object.assign(authorizationModel, { username: text })
              )
            }
            name={"username"}
          />
          <Input
            onChange={(text: string) =>
              setAuthorizationModel(
                Object.assign(authorizationModel, { password: text })
              )
            }
            name={"Password"}
          />
          <button
            onClick={() => {
              register(authorizationModel);
            }}
          >
            OK
          </button>
        </>
      )}
    </>
  );
};
