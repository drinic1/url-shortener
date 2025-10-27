import classes from "./Sidebar.module.css";
import type React from "react";
import CloseButton from "../buttons/closeButton/CloseButton";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement;
  title: string;
  sidebarWidth: string;
  sidebarVisible: boolean;
  setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  children,
  title,
  sidebarWidth,
  sidebarVisible,
  setSidebarVisible,
}: Props) => {
  // const sidebarVisibility = {
  //   width: sidebarVisible ? sidebarWidth : "0",
  //   opacity: sidebarVisible ? "1" : "0",
  //   display: sidebarVisible ? "block" : "none",
  //   // transform: sidebarVisible ? `translateX(0)` : "translateX(100%)",
  // };

  return (
    <div
      className={`${classes.sidebar} ${
        sidebarVisible ? classes.sidebarOpen : ""
      }`}
    >
      {/* style={sidebarVisibility} */}
      <div className={classes.header}>
        <span className={classes.title}>{title}</span>
        <CloseButton onClicked={() => setSidebarVisible(false)}></CloseButton>
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Sidebar;
