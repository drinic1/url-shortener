import classes from "./Header.module.css";
import userService from "../../services/userService";
import { MessageError, type ErrorMessage, type User } from "../../types/types";

interface Props {
  username: string | undefined;
  setSignupSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSigninSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUrlSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<ErrorMessage | undefined>
  >;
}

const Header = ({
  username,
  setSignupSidebarVisible,
  setSigninSidebarVisible,
  setUrlSidebarVisible,
  setUser,
  setErrorMessage,
}: Props) => {
  const signout = async () => {
    try {
      await userService.signout();
      setUser(undefined);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error instanceof MessageError
        ? setErrorMessage(error)
        : console.log(error);
    }
  };
  return (
    <header className={classes.header}>
      <span className={classes.logo}>Url Shortener</span>
      <div className={classes.navbar}>
        <button
          className={classes.btn}
          onClick={() => setUrlSidebarVisible(true)}
        >
          My URLs
        </button>
        {username && (
          <>
            <button className={classes.btn}>{username}</button>
            <button className={classes.btn} onClick={signout}>
              Sign Out
            </button>
          </>
        )}
        {!username && (
          <>
            <button
              className={classes.btn}
              onClick={() => setSignupSidebarVisible(true)}
            >
              Sign Up
            </button>
            <button
              className={classes.btn}
              onClick={() => setSigninSidebarVisible(true)}
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
