import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewTicketMutation } from "./ticketsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewTicketForm = ({ users }) => {
  const [addNewTicket, { isLoading, isSuccess, isError, error }] =
    useAddNewTicketMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [area, setArea] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setClient("");
      setArea("");
      setPlatform("");
      setDescription("");
      setUserId("");
      navigate("/dash/tickets");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onClientChanged = (e) => setClient(e.target.value);
  const onAreaChanged = (e) => setArea(e.target.value);
  const onPlatformChanged = (e) => setPlatform(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, client, area, platform, description, userId].every(Boolean) &&
    !isLoading;

  const onSaveTicketClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewTicket({
        user: userId,
        title,
        client,
        area,
        platform,
        description,
      });
    }
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validClientClass = !client ? "form__input--incomplete" : "";
  const validAreaClass = !area ? "form__input--incomplete" : "";
  const validPlatformClass = !platform ? "form__input--incomplete" : "";
  const validDescriptionClass = !description ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveTicketClicked}>
        <div className="form__title-row">
          <h2>New Ticket</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
          placeholder="I.e., Paragraph Issue"
        />
        <label className="form__label" htmlFor="client">
          Client:
        </label>
        <input
          className={`form__input ${validClientClass}`}
          id="client"
          name="client"
          type="text"
          autoComplete="off"
          value={client}
          onChange={onClientChanged}
          placeholder="I.e., Art of Men Barbershop"
        />
        <label className="form__label" htmlFor="area">
          Area:
        </label>
        <input
          className={`form__input ${validAreaClass}`}
          id="area"
          name="area"
          type="text"
          autoComplete="off"
          value={area}
          onChange={onAreaChanged}
          placeholder="I.e., Front-End or Back-End"
        />
        <label className="form__label" htmlFor="platform">
          Platform:
        </label>
        <input
          className={`form__input ${validPlatformClass}`}
          id="platform"
          name="platform"
          type="text"
          autoComplete="off"
          value={platform}
          onChange={onPlatformChanged}
          placeholder="I.e., Desktop, Web, Mobile-Web, iOS, or Android"
        />

        <label className="form__label" htmlFor="description">
          Description:
        </label>
        <textarea
          className={`form__input form__input--text ${validDescriptionClass}`}
          id="description"
          name="description"
          value={description}
          onChange={onDescriptionChanged}
          placeholder="I.e., On mobile website, the about paragraph..."
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewTicketForm;
