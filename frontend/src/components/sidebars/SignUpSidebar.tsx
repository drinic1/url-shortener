import { useState, type SyntheticEvent } from "react";
import userService from "../../services/userService";
import { MessageError, type ErrorMessage, type User } from "../../types/types";
import ShowPasswordButton from "../buttons/showPasswordButton/ShowPasswordButton";
import Sidebar from "../sidebar/Sidebar";
import classes from "./sidebar.module.css";

interface Props {
  sidebarWidth: string;
  signupSidebarVisible: boolean;
  setSignupSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<ErrorMessage | undefined>
  >;
  switchSidebars: () => void;
}

const SignUpSidebar = ({
  sidebarWidth,
  signupSidebarVisible,
  setSignupSidebarVisible,
  setUser,
  setErrorMessage,
  switchSidebars,
}: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const submitSignup = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const user = await userService.signup(username, email, password);
      // setUsername('');
      // setEmail('');
      // setPassword('');
      setSignupSidebarVisible(false);
      setUser(user);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error instanceof MessageError
        ? setErrorMessage(error)
        : console.log(error);
    }
  };
  return (
    <Sidebar
      title=""
      sidebarWidth={sidebarWidth}
      sidebarVisible={signupSidebarVisible}
      setSidebarVisible={setSignupSidebarVisible}
    >
      <form className={classes.container} onSubmit={submitSignup}>
        {/* <div className={classes.container}> */}
        <div className={classes.signupFormTitle}>
          <span className={classes.logoDark}>Url Shortener</span>
          <div>Welcome to Url Shortener</div>
        </div>
        <label className="label">Username</label>
        <input
          className={classes.input}
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          autoComplete="username"
          minLength={5}
          maxLength={25}
          required
        />
        <label className="label">Email</label>
        <input
          className={classes.input}
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          autoComplete="username"
          required
        />
        <label className="label">Password</label>
        <div className={classes.passwordDiv}>
          <input
            className={classes.noBorder}
            type={passwordHidden ? "password" : "text"}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={25}
            required
          />
          <ShowPasswordButton
            passwordHidden={passwordHidden}
            onClicked={() => setPasswordHidden((prev) => !prev)}
          ></ShowPasswordButton>
        </div>
        <button className="btn btnPrimary" type="submit">
          Create An Account
        </button>
        <div className={classes.linkMessage}>
          Already a user?{" "}
          <button
            className={classes.linkBtn}
            type="button"
            onClick={switchSidebars}
          >
            Log in
          </button>
        </div>
        {/* </div> */}
      </form>
    </Sidebar>
  );
};

export default SignUpSidebar;
