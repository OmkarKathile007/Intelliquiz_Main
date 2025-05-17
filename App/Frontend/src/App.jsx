import { BrowserRouter,Routes,Route } from "react-router-dom"
import Navbar from "./component/Navbar/Navbar"
import Home from "./component/Home/Home"
import Main from "./component/Main/Main"
import Login from "./component/Login/Login"
import AIQuiz from "./Tabs/AIQUIZ/AIQuiz"
import MCQTest from "./Tabs/MCQTest/MCQTest"
import UserDashBoard from "./Tabs/UserDashBoard/UserDashBoard"
import MultiplayerQuiz from "./Tabs/Multiplayer/MulitplayerQuiz"
import CSfundamentals from "./Tabs/MCQTest/CardsQuiz/CSfundamentals"
import DSAfundamentals from "./Tabs/MCQTest/CardsQuiz/DSAfundamentals"
import OA from "./Tabs/MCQTest/CardsQuiz/OA"
// import Aboutus from "./component/Contact/Contact"
import Contact from "./component/Contact/Contact"
import ProtectedRoute from '../utils/ProtectedRoutes'
import Dashboard from "./Tabs/DashBoard/Dashboard"
// import DashBoard from "./Tabs/DashBoard/DashBoard"

function App() {
  // const Location=useLocation();

  // const excludeLocation=['/aiquiz'];

  return (
    <>
        <BrowserRouter>

          <Navbar/>
          {/* {!excludedRoutes.includes(location.pathname) && <Navbar />} */}
          <Routes>
            <Route path="/"  element={<Home/>} />
            <Route element={<ProtectedRoute/>}>
            <Route path="/main" element={<Main/>} />
               <Route path="/aiquiz" element={<AIQuiz/>}/>
               <Route path="/multiplayer" element={<MultiplayerQuiz/>} />
               <Route path="/mcqtest" element={<MCQTest/> } />
               <Route path="/dashboard" element={<Dashboard playerId={1}  /> } />
                   
               
               <Route path="mcqtest/CS_fundamentals" element={<CSfundamentals/>} />
                <Route path="mcqtest/DSA_fundamentals" element={<DSAfundamentals/>} />
                <Route path="mcqtest/Online_Assessment" element={<OA/>} />
               <Route path="mcqtest/userdashboard" element={<UserDashBoard/>} />
            <Route/>
            </Route>
            <Route path="/signup" element={<Login/>} />
            <Route path="/contact" element={<Contact/>} />
            
          </Routes>

        

        </BrowserRouter>
    </>
  )
}

export default App
