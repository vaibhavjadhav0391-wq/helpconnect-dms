
import { Routes, Route, Navigate } from 'react-router-dom';

import { Home, Community, MedicalHome, Announcements, Donate, Admin, Volunteer } from '../pages';
import { Header,Map,Footer,CommunityHome,
  CommunityForum,CommunityVolunteers,
  CommunityChat, Communities, Medicals ,Incidents
} from '../components';
import {Auth} from '../pages/Auth';

import { useSelector } from 'react-redux';


export const AllRoutes = () => {
    const loggedIn = useSelector(state => state.roleState.loggedIn);
    const user = useSelector(state => state.userState.user);

    const adminEmails = ['vaibhav.jadhav04@mit.asia', 'vaibhavjadhav0391@gmail.com'];
    const isAdminEmail = adminEmails.includes((user?.Email || '').toLowerCase());

 
    const locations = [
      { position: [23.7264, 90.3925], popupText: 'Buet' },
      { position: [23.696789, 90.399721], popupText: 'DU' },
      { position: [23.704783, 90.398183], popupText: 'BD' }
    ];
  return (
    <>
      <Header />
      <main className="page-shell">
        {!loggedIn ? (
          <Routes>
            <Route path="/auth/login" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map locations={locations} />} />
            <Route path="/auth" element={<Auth />}>
              <Route path="login" element={<h1>login</h1>} />
              <Route path="register" element={<h1>Register</h1>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
            <Route path="/community/:id" element={loggedIn ? <Community /> : <Navigate to="/auth/login" />}>
              <Route path="" element={<CommunityHome />} />
              <Route path="chat" element={<CommunityChat />} />
              <Route path="announcement" element={<CommunityForum />} />
              <Route path="volunteers" element={<CommunityVolunteers />} />
              <Route path="*" element={<h1>Access Denied !</h1>} />
            </Route>
            <Route path="/communities" element={<Communities />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/announcements" element={loggedIn ? <Announcements /> : <Navigate to="/auth/login" />} />
            <Route path="/donate" element={loggedIn ? <Donate /> : <Navigate to="/auth/login" />} />
            <Route path="/medicals" element={<Medicals />} />
            <Route path="/medical/:id" element={<MedicalHome />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/admin" element={isAdminEmail ? <Admin /> : <Navigate to="/" />} />
            <Route path="*" element={<h1>404 ! Page Not Found</h1>} />
          </Routes>
        )}
      </main>
      <Footer />
      </>
  )
}