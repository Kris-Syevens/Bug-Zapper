import { useState, useEffect } from "react";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "./ticketsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditTicketForm = ({ ticket, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateTicket, { isLoading, isSuccess, isError, error }] =
    useUpdateTicketMutation();

  const [
    deleteTicket,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteTicketMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(ticket.title);
  const [client, setClient] = useState(ticket.client);
  const [area, setArea] = useState(ticket.area);
  const [platform, setPlatform] = useState(ticket.platform);
  const [description, setDescription] = useState(ticket.description);
  const [completed, setCompleted] = useState(ticket.completed);
  const [userId, setUserId] = useState(ticket.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setClient("");
      setArea("");
      setPlatform("");
      setDescription("");
      setUserId("");
      navigate("/dash/tickets");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onClientChanged = (e) => setClient(e.target.value);
  const onAreaChanged = (e) => setArea(e.target.value);
  const onPlatformChanged = (e) => setPlatform(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, client, area, platform, description, userId].every(Boolean) &&
    !isLoading;

  const onSaveTicketClicked = async (e) => {
    if (canSave) {
      await updateTicket({
        id: ticket.id,
        user: userId,
        title,
        client,
        area,
        platform,
        description,
        completed,
      });
    }
  };

  const onDeleteTicketClicked = async () => {
    await deleteTicket({ id: ticket.id });
  };

  const created = new Date(ticket.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(ticket.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validClientClass = !client ? "form__input--incomplete" : "";
  const validAreaClass = !area ? "form__input--incomplete" : "";
  const validPlatformClass = !platform ? "form__input--incomplete" : "";
  const validDescriptionClass = !description ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteTicketClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Ticket #{ticket.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveTicketClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="ticket-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="ticket-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />
        <label className="form__label" htmlFor="ticket-client">
          Client:
        </label>
        <input
          className={`form__input ${validClientClass}`}
          id="ticket-client"
          name="client"
          type="text"
          autoComplete="off"
          value={client}
          onChange={onClientChanged}
        />
        <label className="form__label" htmlFor="ticket-area">
          Area:
        </label>
        <input
          className={`form__input ${validAreaClass}`}
          id="ticket-area"
          name="area"
          type="text"
          autoComplete="off"
          value={area}
          onChange={onAreaChanged}
        />
        <label className="form__label" htmlFor="ticket-platform">
          Platform:
        </label>
        <input
          className={`form__input ${validPlatformClass}`}
          id="ticket-platform"
          name="platform"
          type="text"
          autoComplete="off"
          value={platform}
          onChange={onPlatformChanged}
        />

        <label className="form__label" htmlFor="ticket-description">
          Description:
        </label>
        <textarea
          className={`form__input form__input--text ${validDescriptionClass}`}
          id="ticket-description"
          name="description"
          value={description}
          onChange={onDescriptionChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="ticket-completed"
            >
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="ticket-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>

            <label
              className="form__label form__checkbox-container"
              htmlFor="ticket-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="ticket-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditTicketForm;
