
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import signin from './signinComponent/signin';
import Home from './homeComponent/Home';
import Edit from './editComponent/Edit';
import Register from './registerComponent/Register';

function App() {
  return (
    <div>
     <Router>
        <Routes>
          <Route path='/' Component={signin}/>
          <Route path='/Home' Component={Home}/>
          <Route path='/Edit' Component={Edit}/>node
          <Route path='Register'Component={Register}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
