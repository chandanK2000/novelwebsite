import React, { useEffect, useState} from 'react';
import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import PartManagerPage from './components/partmanager/PartManagerPage';
import AdminPage from './components/admin/AdminPage';
import AddPartManagerPage from './components/partmanager/AddPartManagerPage';
import PageNotFound from './pages/PageNotFound';
import EditPartManagerPage from './components/partmanager/EditPartManagerPage';
import GoToTop from "./components/GoToTop";
import AutoLogout from './components/AutoLogout';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import AddUserDetails from './components/userdetails/AddUserDetails';
import EditUserDetails from './components/userdetails/EditUserDetails';
import UserView from './components/userdetails/UserView';
import MultiSelectSerializedPage from './components/serilization/MultiSelectSerializedPage';
import MultiSelectPrintDetailsPage from './components/printmanager/MultiSelectPrintDetailsPage';
import MultiSelectRePrintDetailsPage from './components/printmanager/MultiSelectRePrintDetailsPage';
import PlannerPageUpdated from './PlannerPageUpdated';
import NetworkStatus from './pages/NetworkStatus/NetworkStatus';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import PrivateRoute from './PrivateRoute';
import Inspection from './components/InspectionModule/Inspection';
import CreateProject from './components/InspectionModule/CreateProject';
import DesignAndDrawing from './components/InspectionModule/DesignAndDrawing';
import EditProject from './components/InspectionModule/EditProject';

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const handleOnline = () => setIsOffline(false);
  const handleOffline = () => setIsOffline(true);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return <NetworkStatus />;
  }

  return (
    <Router>
      <div className="app-container">
        <Header />
        <AutoLogout />
        <div className="main-content">
          <Routes>
            <Route exact path='/' element={<Home />} />
            {/* <Route exact path='/login' element={<Login />} />
            <Route exact path='/signup' element={<Signup />} /> */}

            {/* Protected Routes */}
            <Route exact path='/serialization' element={<PrivateRoute><MultiSelectSerializedPage /></PrivateRoute>} />
            <Route exact path='/part-manager' element={<PrivateRoute><PartManagerPage /></PrivateRoute>} />
            <Route exact path='/admin-dashboard' element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route exact path='/print-manager' element={<PrivateRoute><MultiSelectPrintDetailsPage /></PrivateRoute>} />
            <Route exact path='/Reprint-manager' element={<PrivateRoute><MultiSelectRePrintDetailsPage /></PrivateRoute>} />
            <Route exact path='/add-part-manager' element={<PrivateRoute><AddPartManagerPage /></PrivateRoute>} />
            <Route exact path='/editpart_manager/:id' element={<PrivateRoute><EditPartManagerPage /></PrivateRoute>} />
            <Route exact path='/planner-Page' element={<PrivateRoute><PlannerPageUpdated /></PrivateRoute>} />
            <Route exact path='/adduser' element={<PrivateRoute><AddUserDetails /></PrivateRoute>} />
            <Route path="/edit/:userId" element={<PrivateRoute><EditUserDetails /></PrivateRoute>} />
            <Route path="/view/:userId" element={<PrivateRoute><UserView /></PrivateRoute>} />
            {/* <Route path="/qa" element={<Navigate to="/inspectionmodule" replace />} /> */}
            <Route path="/inspectionmodule" element={<PrivateRoute><Inspection /></PrivateRoute>} />
            <Route path="/createproject" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
            <Route path="/designanddrawing" element={<PrivateRoute><DesignAndDrawing /></PrivateRoute>} />
            <Route path="/edit-project/:id" element={<PrivateRoute><EditProject /></PrivateRoute>} />




            
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
        <GoToTop />
      </div>
    </Router>
  );
}

export default App;
