
import { Route, Routes,  BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import signin from "./components/signinComponent/signin";
import Home from './components/homeComponent/Home';
import Register from './components/registerComponent/Register';

function App() {

  return (
    <div>

      <BrowserRouter>
      <Routes>
              <Route path='/' Component={signin} />
              <Route path='Register' Component={Register} />
              <Route path='/Home' Component={Home} />
            </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
