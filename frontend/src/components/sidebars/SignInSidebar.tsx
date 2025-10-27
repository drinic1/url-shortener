import { useState, type SyntheticEvent } from "react";
import userService from "../../services/userService";
import { MessageError, type ErrorMessage, type User } from "../../types/types";
import ShowPasswordButton from "../buttons/showPasswordButton/ShowPasswordButton";
import Sidebar from "../sidebar/Sidebar";
import classes from "./sidebar.module.css";

interface Props {
  sidebarWidth: string;
  signinSidebarVisible: boolean;
  setSigninSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<ErrorMessage | undefined>
  >;
  switchSidebars: () => void;
}

const SignInSidebar = ({
  sidebarWidth,
  signinSidebarVisible,
  setSigninSidebarVisible,
  setUser,
  setErrorMessage,
  switchSidebars,
}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const submitSignin = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const user = await userService.signin(email, password);
      // setEmail('');
      // setPassword('');
      setSigninSidebarVisible(false);
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
      sidebarVisible={signinSidebarVisible}
      setSidebarVisible={setSigninSidebarVisible}
    >
      <form className={classes.container} onSubmit={submitSignin}>
        {/* <div className={classes.signupForm}> */}
        <div className={classes.signupFormTitle}>
          <span className={classes.logoDark}>Url Shortener</span>
          <div>Welcome to Url Shortener</div>
        </div>
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
            autoComplete="current-password"
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
          Sign In
        </button>
        <div className={classes.linkMessage}>
          Don't have an account?
          <button
            className={classes.linkBtn}
            type="button"
            onClick={switchSidebars}
          >
            Sign Up
          </button>
        </div>
        {/* </div> */}
      </form>
    </Sidebar>
  );
};
export default SignInSidebar;
