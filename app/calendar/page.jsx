"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPA_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTimeFrom, setNewEventTimeFrom] = useState("");
  const [newEventTimeTo, setNewEventTimeTo] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchEvents();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(currentEvents);
    }
  }, [currentEvents]);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      const formattedEvents = data.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        extendedProps: { location: event.location },
      }));

      const sortedEvents = formattedEvents.sort((a, b) => a.start - b.start);
      setCurrentEvents(sortedEvents);
    }
  };

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = async (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", selected.event.id);

      if (error) {
        console.error("Error deleting event:", error);
      } else {
        await fetchEvents();
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
    setNewEventTimeFrom("");
    setNewEventTimeTo("");
    setNewEventLocation("");
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const startDate = new Date(selectedDate.startStr);
      const [startHours, startMinutes] = newEventTimeFrom.split(':');
      startDate.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));

      const endDate = new Date(selectedDate.startStr);
      const [endHours, endMinutes] = newEventTimeTo.split(':');
      endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));

      const newEvent = {
        title: newEventTitle,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        location: newEventLocation,
      };

      const { data, error } = await supabase
        .from("events")
        .insert([newEvent])
        .select();

      if (error) {
        console.error("Error adding event:", error);
      } else {
        await fetchEvents();
        handleCloseDialog();
      }
    }
  };

  const formatEventTime = (date) => {
    return formatDate(date, {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full px-4 mt-10 pt-20 md:px-10 justify-start items-start gap-8">
      <motion.div
        className="w-full md:w-3/12 mb-8 md:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="py-6 md:py-10 text-xl md:text-2xl font-extrabold px-4 md:px-7">City Calendar Events</div>
        <ul className="space-y-4">
          {currentEvents.length <= 0 && (
            <div className="italic text-center text-gray-400">
              No Events Present
            </div>
          )}

          {currentEvents.length > 0 &&
            currentEvents.map((event) => (
              <motion.li
                className="border border-gray-200 shadow px-4 py-2 rounded-md text-gray-600"
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {event.title}
                <br />
                <label className="text-gray-600">
                  {formatDate(event.start, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {formatEventTime(event.start)} - {formatEventTime(event.end)}
                </label>
                <br />
                <label className="text-gray-600">
                  Location: {event.extendedProps.location}
                </label>
              </motion.li>
            ))}
        </ul>
      </motion.div>

      <motion.div
        className="w-full md:w-9/12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FullCalendar
          ref={calendarRef}
          height={isMobile ? "auto" : "85vh"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: isMobile ? "dayGridMonth,listWeek" : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          initialView={isMobile ? "listWeek" : "dayGridMonth"}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          eventClick={handleEventClick}
          events={currentEvents}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
        />
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Add New Event Details</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 pt-4" onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                className="w-full border border-gray-200 bg-slate-800 p-3 rounded-md text-lg"
              />
              <div className="flex space-x-4">
                <input
                  type="time"
                  value={newEventTimeFrom}
                  onChange={(e) => setNewEventTimeFrom(e.target.value)}
                  required
                  className="w-1/2 border border-gray-200 bg-slate-800 p-3 rounded-md text-lg"
                />
                <input
                  type="time"
                  value={newEventTimeTo}
                  onChange={(e) => setNewEventTimeTo(e.target.value)}
                  required
                  className="w-1/2 border border-gray-200 bg-slate-800 p-3 rounded-md text-lg"
                />
              </div>
              <input
                type="text"
                placeholder="Location"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="w-full border border-gray-200 bg-slate-800 p-3 rounded-md text-lg"
              />
              <motion.button
                className="w-full bg-green-500 text-white p-3 rounded-md"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Event
              </motion.button>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;