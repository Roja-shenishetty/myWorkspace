import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all the module pages
import EventDashboard from './EventDashboard';      // Page to SELECT an event
import EventModuleLayout from './EventModuleLayout';   // Layout WITH sidebar
import EventHome from './EventHome';               // The "Dashboard" for a single event
import DonationsPage from './dontations/DonationsPage';
import RsvpPage from './rsvp/RsvpPage';
import GalleryPage from './gallery/GalleryPage';
import TaskTracker from './task-tracker/TaskTracker';
import RecognizeFriendPage from './recognize-friend/RecognizeFriendPage';

/*
* This component defines all routes for your new module.
* You would integrate this into your main App's router.
* For example: <Route path="/events/*" element={<EventRoutes />} />
*/
export default function EventRoutes() {
  return (
    <Routes>
      {/* 1. /events - The main event selection page */}
      <Route index element={<EventDashboard />} />

      {/* 2. /events/:eventId/* - All pages for a *specific* event */}
      <Route path=":eventId" element={<EventModuleLayout />}>
        <Route index element={<EventHome />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="rsvp" element={<RsvpPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="tasks" element={<TaskTracker />} />
        <Route path="recognize" element={<RecognizeFriendPage />} />
      </Route>
    </Routes>
  );
}