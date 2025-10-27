import classes from "./UrlEntry.module.css";
import urlService from "../../services/urlService";
import { useRef, useState } from "react";
import AliasUpdateForm from "./aliasUpdateForm/AliasUpdateForm";
import DeleteButton from "../buttons/deleteButton/DeleteButton";

interface Props {
  id: string;
  url: string;
  domain: string;
  alias: string;
  updated: string;
  refreshUrls: (id: string) => void;
  updateAliasAndUpdated: (id: string, newAlias: string) => void;
}

const UrlEntry = ({
  id,
  url,
  domain,
  alias,
  updated,
  refreshUrls,
  updateAliasAndUpdated,
}: Props) => {
  const aliasRef = useRef<HTMLDivElement>(null);
  const [editEnabled, setEditEnabled] = useState(false);
  const [copyText, setCopyText] = useState("Copy");

  const deleteUrl = async () => {
    await urlService.deleteUrl(id);
    refreshUrls(id);
  };

  const copyToClipboard = () => {
    if (aliasRef.current)
      navigator.clipboard.writeText(aliasRef.current.innerText);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 3000);
  };

  const displayUpdatedTime = () => {
    const updatedDate = new Date(updated);
    const nowDate = new Date();
    const yearsDelta = nowDate.getFullYear() - updatedDate.getFullYear();
    if (yearsDelta > 0) {
      return yearsDelta == 1 ? "a year ago" : `${yearsDelta} years ago`;
    }
    //same year
    const monthsDelta = nowDate.getMonth() - updatedDate.getMonth();
    if (monthsDelta > 0) {
      return monthsDelta == 1 ? "a month ago" : `${monthsDelta} months ago`;
    }
    //same month
    const daysDelta = nowDate.getDate() - updatedDate.getDate();
    if (daysDelta > 0) {
      return daysDelta == 1 ? "a day ago" : `${daysDelta} days ago`;
    }
    //same day
    const hoursDelta = nowDate.getHours() - updatedDate.getHours();
    if (hoursDelta > 0) {
      return hoursDelta == 1 ? "an hour ago" : `${hoursDelta} hours ago`;
    }
    //same hour
    const minutesDelta = nowDate.getMinutes() - updatedDate.getMinutes();
    if (minutesDelta > 0) {
      return minutesDelta == 1 ? "1 minute ago" : `${minutesDelta} minutes ago`;
    }
    //same minute
    return "a few seconds ago";
  };

  return (
    <div className={classes.urlEntryStyle}>
      {!editEnabled && (
        <div className={classes.alias} ref={aliasRef}>
          {domain}
          {alias}
        </div>
      )}
      {editEnabled && (
        <AliasUpdateForm
          id={id}
          domain={domain}
          alias={alias}
          setEditEnabled={setEditEnabled}
          updateAliasAndUpdated={updateAliasAndUpdated}
        ></AliasUpdateForm>
      )}
      <div className={classes.url}>{url}</div>
      <div className={classes.updated}>{displayUpdatedTime()}</div>
      <div className={classes.buttonRow}>
        <button
          className={classes.btnSecondarySmall}
          onClick={() => setEditEnabled(!editEnabled)}
          disabled={editEnabled}
        >
          <div className={classes.tooltip}>Change your shortened URL</div>
          Rename
        </button>
        <button className={classes.btnPrimarySmall} onClick={copyToClipboard}>
          {copyText}
        </button>
        <DeleteButton onClicked={deleteUrl}></DeleteButton>
      </div>
    </div>
  );
};

export default UrlEntry;
