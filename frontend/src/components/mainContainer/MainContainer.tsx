import { useState, type SyntheticEvent } from "react";
import classes from "./MainContainer.module.css";
import urlService from "../../services/urlService";
import { MessageError, type ErrorMessage, type User } from "../../types/types";

interface Props {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  urlSidebarVisible: boolean;
  setUrlSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<ErrorMessage | undefined>
  >;
}

const MainContainer = ({
  user,
  setUser,
  urlSidebarVisible,
  setUrlSidebarVisible,
  setErrorMessage,
}: Props) => {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [urlResult, setUrlResult] = useState("");
  const [aliasResult, setAliasResult] = useState("");
  const [linkSubmitted, setLinkSubmitted] = useState(false);

  const baseUrl = import.meta.env.VITE_REDIRECT_BASE_LABEL;

  const submitNewUrl = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const newUrl = await urlService.createNewUrl(url, alias);
      // setUrlEntries(urlEntries.concat(newUrl));
      if (user) {
        setUser({ ...user, urls: user.urls.concat(newUrl) });
      }
      setLinkSubmitted(true);
      setUrl("");
      setAlias("");
      setUrlResult(newUrl.url);
      setAliasResult(newUrl.alias);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error instanceof MessageError
        ? setErrorMessage(error)
        : console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      {!linkSubmitted && (
        <form onSubmit={submitNewUrl}>
          <div className={classes.formContent}>
            <label className="label">Shorten a long URL</label>
            <input
              className="input"
              type="url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              placeholder="Enter long link here"
            />
            <label className="label">Customize your link</label>
            <div className={classes.domainDiv}>
              <label className={classes.domainName}>{baseUrl}</label>
              <input
                className="input"
                type="text"
                value={alias}
                onChange={({ target }) => setAlias(target.value)}
                placeholder="Enter alias"
              />
            </div>
            <button className="btn btnPrimary" type="submit">
              Shorten URL
            </button>
          </div>
        </form>
      )}
      {linkSubmitted && (
        <div className={classes.formContent}>
          <label className="label">Your long URL</label>
          <input
            className="input"
            type="url"
            value={urlResult}
            readOnly={true}
          />
          <label className="label">Short URL</label>
          <input
            className="input"
            type="url"
            value={aliasResult}
            readOnly={true}
          />
          <div className={classes.buttonDiv}>
            <button
              className={classes.btnOutlinePrimary}
              onClick={() => setUrlSidebarVisible(!urlSidebarVisible)}
            >
              My URLs
            </button>
            <button
              className="btn btnPrimary"
              onClick={() => setLinkSubmitted(false)}
            >
              Shorten another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContainer;
