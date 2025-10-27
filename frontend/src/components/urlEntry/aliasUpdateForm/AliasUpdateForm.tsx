import { useState, type SyntheticEvent } from "react";
import urlService from "../../../services/urlService";
import classes from "./AliasUpdateForm.module.css";
import CloseButton from "../../buttons/closeButton/CloseButton";

interface Props {
  id: string;
  domain: string;
  alias: string;
  setEditEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  updateAliasAndUpdated: (id: string, newAlias: string) => void;
}

const AliasUpdateForm = ({
  id,
  domain,
  alias,
  setEditEnabled,
  updateAliasAndUpdated,
}: Props) => {
  const [currentAlias, setCurrentAlias] = useState(alias);

  const updateNewAlias = async (e: SyntheticEvent) => {
    e.preventDefault();
    await urlService.renameAlias(id, currentAlias);
    setEditEnabled(false);
    updateAliasAndUpdated(id, currentAlias);
  };

  return (
    <form onSubmit={updateNewAlias}>
      <div className={classes.container}>
        <div className={classes.domain}>{domain}</div>
        <div className={classes.formDiv}>
          <input
            className={classes.input}
            value={currentAlias}
            onChange={({ target }) => setCurrentAlias(target.value)}
          />
          <button className={classes.btnConfirm} type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>check</title>
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
          </button>
          {/* <button
          className={classes.btnDismiss}
          type="button"
          onClick={() => setEditEnabled(false)}
          >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>close</title>
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
          </button> */}
          <CloseButton
            className={classes.btnDismiss}
            onClicked={() => setEditEnabled(false)}
          />
        </div>
      </div>
    </form>
  );
};

export default AliasUpdateForm;
