import styled from "styled-components";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UserProfile from "../../components/Modals/UserProfile";
import Loader from "../../components/Modals/Loader";
import Modal from "../../components/Modals/Modal";
import DeleteModal from "../../components/Modals/DeleteModal";
import DeleteButton from "../../components/Buttons/DeleteButton";
import DestinationList from "../../components/Destination/DestinationList";
import Duration from "../../components/Duration";

import { getTripById } from "../../services/tripService";
import { getDestinationsByTripId } from "../../services/destinationService";
import { getAllToDos } from "../../services/toDoService";

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const id = context.params.id;
  const trip = await getTripById(id, session.user.email);
  const destinationsDB = await getDestinationsByTripId(id);
  const toDosDB = await getAllToDos();

  return {
    props: { id: id, destinationsDB, countryName: trip?.error ? "Not found" : trip.country, toDosDB },
  };
}

export default function Destinations({ id, destinationsDB, countryName, toDosDB }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [destinations, setDestinations] = useState(destinationsDB);
  const [modal, setModal] = useState({ visible: false, name: "" });
  const [loader, setLoader] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [deleteDestinationId, setDeleteDestinationId] = useState(0);

  const toggleShowProfile = () => setShowProfile((showProfile) => !showProfile);
  const toggleLoader = () => setLoader((loader) => !loader);
  const toggleModal = (modalName = "", type = "") =>
    setModal((modal) => ({ visible: !modal.visible, name: modalName, type: type }));

  const calculateTotalDuration = () => {
    const minDate = Math.min(
      ...destinations.filter((filtered) => filtered.tripId === id).map((destination) => destination.startDate)
    );
    const maxDate = Math.max(
      ...destinations.filter((filtered) => filtered.tripId === id).map((destination) => destination.endDate)
    );
    const dayDifference = (maxDate - minDate) / 86400 + 1;
    return dayDifference > 0 ? Math.floor(dayDifference) : 0;
  };

  const onSubmitNewDestination = async (destinationName) => {
    toggleLoader();
    const res = await fetch("/api/destinations/?tripId=" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: destinationName }),
    });
    const newTrips = await res.json();
    toggleLoader();

    setDestinations(newTrips);

    setTimeout(() => {
      window.scrollBy({ top: 100, behavior: "smooth" });
    }, 100);
  };

  const onDeleteDestination = async (id, tripId) => {
    toggleLoader();
    const res = await fetch("/api/destinations/" + id + "?tripId=" + tripId, {
      method: "DELETE",
    });
    const newDestinations = await res.json();
    setDestinations(newDestinations);
    toggleLoader();
  };

  const onDeleteTrip = async (id) => await fetch("/api/trips/" + id, { method: "DELETE" });

  const onDeleteAccount = async () => {
    const res = await fetch("/api/trips", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (res.error) return alert(res.error);
  };

  return (
    <>
      <Header
        coverImage={countryName}
        showProfile={showProfile}
        session={session}
        toggleShowProfile={toggleShowProfile}
      />

      <MainCard>
        {showProfile && (
          <UserProfile
            session={session}
            toggleShowProfile={toggleShowProfile}
            showProfile={showProfile}
            deleteAccount={() => toggleModal("account", "account")}
            signOut={() => {
              toggleLoader();
              signOut();
            }}
          />
        )}
        <DestinationHeadline>{countryName.toUpperCase()}</DestinationHeadline>
        {countryName !== "Not found" && (
          <DestinationList
            destinations={destinations}
            toDos={toDosDB}
            tripId={id}
            onSubmitNewDestination={onSubmitNewDestination}
            toggleModal={toggleModal}
            setDeleteDestinationId={setDeleteDestinationId}
          />
        )}
      </MainCard>
      {countryName !== "Not found" && (
        <Footer>
          <Duration title="Total duration" number={calculateTotalDuration()} type="day" />
          <DeleteButton
            onClick={() => toggleModal(countryName, "trip")}
            icon="trashCan"
            width="25px"
            height="25px"
            ariaLabel="Delete trip"
          />
        </Footer>
      )}
      {modal.visible && modal.type === "trip" && (
        <Modal name={`Delete ${modal.name}`} toggleModal={toggleModal}>
          <DeleteModal
            name={modal.name}
            onClick={async () => {
              await onDeleteTrip(id);
              router.push("/", null, { shallow: false });
            }}
          />
        </Modal>
      )}
      {modal.visible && modal.type === "destination" && (
        <Modal name={`Delete ${modal.name}`} toggleModal={toggleModal}>
          <DeleteModal
            name={modal.name}
            onClick={() => {
              onDeleteDestination(deleteDestinationId, id);
              toggleModal();
            }}
          />
        </Modal>
      )}
      {modal.visible && modal.type === "account" && (
        <Modal name={`Delete ${modal.name}`} toggleModal={toggleModal}>
          <DeleteModal
            name={modal.name}
            onClick={async () => {
              toggleLoader();
              toggleModal();
              await onDeleteAccount();
              signOut();
            }}
          />
        </Modal>
      )}
      {loader && <Loader />}
    </>
  );
}

const MainCard = styled.main`
  position: absolute;
  top: 40vh;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  background-color: var(--background-primary);
  width: 100vw;
`;

const DestinationHeadline = styled.h1`
  margin: 1em 0 0.5em;
  text-align: center;
`;
