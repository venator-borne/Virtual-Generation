import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import { ModelsProvider } from "./lib/ModelsContext.jsx";
import BasicTabs from "./components/tabs/Tabs.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/app"
             element={
               <ModelsProvider>
                 <BasicTabs/>
               </ModelsProvider>
             }/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
