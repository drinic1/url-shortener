import { useNavigate } from "react-router";
import ErrorModal from "../errorModal/ErrorModal";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <ErrorModal
        header="Page not found"
        message={`The requested URL was not found on this server.`}
        buttonText="Go to Homepage"
        onClicked={() => navigate("/")}
      ></ErrorModal>
    </>
  );
};

export default NotFound;
