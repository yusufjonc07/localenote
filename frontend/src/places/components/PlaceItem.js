import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { useHttpHook } from "../../shared/hooks/http-hook";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const auth = useContext(AuthContext);
  const { sendRequest, HttpFeedback } = useHttpHook();
  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteWarningHandler = () => setShowConfirmModal(false);

  const confirmDeletionHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      props.onDelete(props.id);
    } catch (error) {}

    setShowConfirmModal(false);
  };

  return (
    <React.Fragment>
      <HttpFeedback />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        header="Confirm Deletion"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={confirmDeletionHandler}>Confirm</Button>
            <Button onClick={cancelDeleteWarningHandler} danger>
              CLOSE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Are your sure to delete {props.title} ? After the deleteion of the{" "}
          {props.title}, you cannot undone this action! So please be carefull.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}/edit`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
