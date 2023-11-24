import { useSelector } from "react-redux";
import "./App.css";
import Home from "./components/home/home";
import Login from "./components/login/login";

function App() {
  const appState = useSelector((state) => state.globalAppState);

  return (
    <div className="App">
      {appState.isAuth ? (
        <>
          <Home />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
