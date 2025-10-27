import { useNavigate, useParams } from "react-router";
import redirectService from "../../services/redirectService";
import { useEffect, useState } from "react";
import classes from "./messages.module.css";
import { MessageError } from "../../types/types";

const AliasRedirect = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [alias] = useState<string | undefined>(params["*"]); //params.alias

  useEffect(() => {
    if (!alias) {
      navigate("/");
      return;
    }
    redirectService
      .redirect(alias)
      .then((url) => {
        console.log(url);
        window.location.href = url;
      })
      .catch((error: unknown) => {
        if (error instanceof MessageError) {
          navigate("/not-found");
        }
        console.log(error);
      });
  }, [alias, navigate]);

  return (
    <>
      <div className={classes.container}>
        <p className={classes.title}>Redirecting...</p>
      </div>
    </>
  );
};

export default AliasRedirect;
