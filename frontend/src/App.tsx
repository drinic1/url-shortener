import { useState } from "react";
import "./App.css";
import { type ErrorMessage } from "./types/types";
import Background from "./components/background/Background";
import ErrorModal from "./components/errorModal/ErrorModal";
import Home from "./Home";
import { Routes, Route } from "react-router";
import AliasRedirect from "./components/messages/AliasRedirect";
import NotFound from "./components/messages/NotFound";

const App = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | undefined>(
    undefined
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          }
        />
        <Route path="/not-found" element={<NotFound />}></Route>
        <Route path="*" element={<AliasRedirect />}></Route>
        {/* <Route path="*" element={<Navigate to="/not-found" replace />}></Route> */}
      </Routes>
      <Background />
      {errorMessage && (
        <ErrorModal
          header={errorMessage.header}
          message={errorMessage.message}
          onClicked={() => setErrorMessage(undefined)}
        ></ErrorModal>
      )}
    </>
  );
};

export default App;
