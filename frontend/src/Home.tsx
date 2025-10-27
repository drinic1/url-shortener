import { useState, useEffect, type CSSProperties } from "react";
import styled from "styled-components";
import Header from "./components/header/Header";
import MainContainer from "./components/mainContainer/MainContainer";
import Sidebar from "./components/sidebar/Sidebar";
import SignInSidebar from "./components/sidebars/SignInSidebar";
import SignUpSidebar from "./components/sidebars/SignUpSidebar";
import userService from "./services/userService";
import type { ErrorMessage, User } from "./types/types";
import UrlEntry from "./components/urlEntry/UrlEntry";

const SidebarBackdrop = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  opacity: 0;
  background-color: rgb(0, 0, 0, 0.4);
`;

interface Props {
  errorMessage: ErrorMessage | undefined;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<ErrorMessage | undefined>
  >;
}

const Home = ({ errorMessage, setErrorMessage }: Props) => {
  const [urlSidebarVisible, setUrlSidebarVisible] = useState(false);
  const [signinSidebarVisible, setSigninSidebarVisible] = useState(false);
  const [signupSidebarVisible, setSignupSidebarVisible] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const baseUrl = import.meta.env.VITE_REDIRECT_BASE_LABEL;

  useEffect(() => {
    userService
      .checkStatus()
      .then((user: User) => {
        setUser(user);
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }, []);

  const refreshUrls = (id: string) => {
    //setUrlEntries(urlEntries.filter((url) => url.id !== id));
    if (user) {
      setUser({ ...user, urls: user.urls.filter((url) => url.id !== id) });
    }
  };
  const switchSidebars = () => {
    setSignupSidebarVisible(!signupSidebarVisible);
    setSigninSidebarVisible(!signinSidebarVisible);
  };

  const backdropVisibility: CSSProperties | undefined = {
    opacity:
      urlSidebarVisible ||
      signupSidebarVisible ||
      signinSidebarVisible ||
      errorMessage
        ? "1"
        : "0",
    visibility:
      urlSidebarVisible ||
      signupSidebarVisible ||
      signinSidebarVisible ||
      errorMessage
        ? "visible"
        : "hidden",
  };

  const hideSideBackdrop = () => {
    if (urlSidebarVisible) setUrlSidebarVisible(!urlSidebarVisible);
    if (signupSidebarVisible) setSignupSidebarVisible(!signupSidebarVisible);
    if (signinSidebarVisible) setSigninSidebarVisible(!signinSidebarVisible);
  };

  const updateAliasAndUpdated = (id: string, newAlias: string) => {
    if (user) {
      setUser({
        ...user,
        urls: user.urls.map((entry) => {
          return {
            ...entry,
            alias: entry.id === id ? newAlias : entry.alias,
            updated: entry.id === id ? Date.now().toString() : entry.updated,
          };
        }),
      });
    }
  };
  return (
    <>
      <SidebarBackdrop
        style={backdropVisibility}
        onClick={hideSideBackdrop}
      ></SidebarBackdrop>

      <Header
        username={user?.username}
        setSignupSidebarVisible={setSignupSidebarVisible}
        setSigninSidebarVisible={setSigninSidebarVisible}
        setUrlSidebarVisible={setUrlSidebarVisible}
        setUser={setUser}
        setErrorMessage={setErrorMessage}
      ></Header>

      <MainContainer
        user={user}
        setUser={setUser}
        setErrorMessage={setErrorMessage}
        urlSidebarVisible={urlSidebarVisible}
        setUrlSidebarVisible={setUrlSidebarVisible}
      ></MainContainer>

      <Sidebar
        title="Your recent short URLs"
        sidebarWidth="70vw"
        sidebarVisible={urlSidebarVisible}
        setSidebarVisible={setUrlSidebarVisible}
      >
        <div className="flexColumn">
          {user?.urls.map((entry) => (
            <UrlEntry
              key={entry.alias}
              id={entry.id}
              url={entry.url}
              domain={baseUrl}
              alias={entry.alias}
              updated={entry.updated}
              refreshUrls={refreshUrls}
              updateAliasAndUpdated={updateAliasAndUpdated}
            ></UrlEntry>
          ))}
        </div>
      </Sidebar>

      {!user && (
        <>
          <SignUpSidebar
            sidebarWidth="500px"
            signupSidebarVisible={signupSidebarVisible}
            setSignupSidebarVisible={setSignupSidebarVisible}
            setUser={setUser}
            setErrorMessage={setErrorMessage}
            switchSidebars={switchSidebars}
          ></SignUpSidebar>

          <SignInSidebar
            sidebarWidth="500px"
            signinSidebarVisible={signinSidebarVisible}
            setSigninSidebarVisible={setSigninSidebarVisible}
            setUser={setUser}
            setErrorMessage={setErrorMessage}
            switchSidebars={switchSidebars}
          ></SignInSidebar>
        </>
      )}
    </>
  );
};

export default Home;
