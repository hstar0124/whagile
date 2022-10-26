// import "./assets/themes/soho/soho-dark/theme.css";  //theme
import "./assets/themes/soho/soho-dark/theme.scss"; //theme
// require('./assets/themes/soho/soho-dark/theme.scss');  //theme
import "primereact/resources/primereact.min.css";   //core css
import "primeicons/primeicons.css";                 //icons
import "./App.css";

import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';
import ProjectLayout from './layouts/ProjectLayout';
import Main from './pages/main/Main';
import Profile from "./pages/profile/Profile";
import Inquiry from "./pages/inquiry/Inquiry.js";

import Dashboard from './pages/project/dashboard/Dashboard';
import BacklogAndSprint from './pages/project/backlog-and-sprint/BacklogAndSprint';
import GanttChart from './pages/project/gantt/GanttChart';
import KanbanBoard from "./pages/project/kanban/KanbanBoard";
import List  from './pages/projects/List';
import Regist  from './pages/projects/Regist';
import History from './pages/project/history/History';
import Information from "./pages/project/management/Information";
import TeamMateList from "./pages/project/management/TeamMateList";
import Statistics from "./pages/project/management/Statistics";
import InvitedMemberSignup from "./pages/project/management/registration/InvitedMemberSignup";

// admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminMember from './pages/admin/member/AdminMember';
import AdminAuth from './pages/admin/auth/AdminAuth';
import AdminProduct from './pages/admin/product/AdminProduct';
import AdminInquiry from './pages/admin/inquiry/AdminInquiry';
import AdminStatistics from './pages/admin/statistics/AdminStatistics';

// NotFound
import NotFound from './pages/notFound/NotFound';

function App() {

  const isLogin = window.sessionStorage.getItem('isLogin');
  console.log("app", isLogin);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        {/* { isLogin ? <Navigate replace to ="/main" /> : <Login/>} */}
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/invitedMemberSignup/:projectCode/:email"
          element={<InvitedMemberSignup />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/project/:projectCode" element={<ProjectLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="backlog-and-sprint" element={<BacklogAndSprint />} />
          <Route path="gantt" element={<GanttChart />} />
          <Route path="kanban-board" element={<KanbanBoard />} />
          <Route path="history" element={<History />} />
          <Route path="management">
            <Route path="information" element={<Information />} />
            <Route path="teamMateList" element={<TeamMateList />} />
            <Route path="statistics" element={<Statistics />} />
          </Route>
        </Route>

        {/* admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="member" element={<AdminMember />} />
          <Route path="auth" element={<AdminAuth />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="inquery" element={<AdminInquiry />} />
          <Route path="statistics" element={<AdminStatistics />} />
        </Route>

        <Route path="/projects" element={<List />} />
        <Route path="/projects/regist" element={<Regist />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;