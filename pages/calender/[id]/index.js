import Modal from "@/components/calender/OpenModal";
import HomeLayout from "@/components/HomeLayout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import RevoCalendar from "revo-calendar";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "@/supabase";

const notify = () =>
  toast.success("Event has been successfully created", {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

function Calender({ calenderEvents }) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formInput, setFormInput] = useState({
    name: "",
    text: "",
    date: null,
  });

  const supabase = useSupabaseClient();

  useEffect(() => {
    setEvents(calenderEvents);
  }, []);

  function fetchEvents() {
    supabase
      .from("calender")
      .select("name, date, extra")
      .then((response) => [setEvents(response.data)]);
  }

  function handleCreateFunction() {
    supabase
      .from("calender")
      .insert({
        name: formInput.name,
        date: formInput.date,
        extra: { text: formInput.text },
      })
      .then((response) => {
        if (!response.error) {
          fetchEvents();
          notify();
          setFormInput({
            name: "",
            text: "",
            date: null,
          });
        }
        setShowModal(false);
      });
  }

  const deleteEvent = (event) => {
    console.log("delete", event);
  };

  const addEvent = (event) => {
    setFormInput({ date: new Date(event).getTime() });
    setShowModal(true);
  };
  return (
  
      <HomeLayout>
        <RevoCalendar
          events={events}
          // style={{ height: "88vh" }}
          timeFormat24={false}
          // highlightToday={true}
          lang="en"
          primaryColor="#1a8cff"
          secondaryColor="#ffff"
          // todayColor="#3B3966"
          textColor="black"
          indicatorColor="red"
          animationSpeed={300}
          sidebarWidth={180}
          sidebarDefault={false}
          detailDefault={false}
          // detailWidth={280}
          // showDetailToggler={true}
          // showSidebarToggler={true}
          // onePanelAtATime={false}
          // allowDeleteEvent={true}
          allowAddEvent={true}
          // openDetailsOnDateSelection={true}
          // timeFormat24={true}
          // showAllDayLabel={false}
          // detailDateFormat="DD/MM/YYYY"
          // deleteEvent={deleteEvent}
          addEvent={addEvent}
        />
        <Modal
          handleCreateFunction={handleCreateFunction}
          showModal={showModal}
          setShowModal={setShowModal}
          formInput={formInput}
          setFormInput={setFormInput}
        />
      </HomeLayout>
  
  );
}

export async function getServerSideProps(context) {
  const data = await supabase.from("calender").select("name, date, extra");
  return {
    props: {
      calenderEvents: data.data,
    },
  };
}

export default Calender;
