import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import HomeView from "./views/HomeView";
import Layout from "./layout/Layout";
import Generar from "./views/Generar";
import Transferencia from "./views/Transferencia";
import Historial from "./views/Historial";
import Ubicacion from "./views/Ubicacion";
import { AuthStore } from "./stores/AuthStore";
import LoginView from "./views/LoginView";
import TransPallet from "./views/TransPallet";
import Anularview from "./views/Anularview";
import ScanDetallePallet from "./views/ScanDetallePallet";


function App() {
  const stateAuth = AuthStore((state) => state.stateAuth);
  // const stateAuth = true;

  return (
    <>
      <BrowserRouter basename="/movAlmacen">
        <Routes>
          <Route
            path="/"
            element={
              stateAuth ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={stateAuth ? <Navigate to={`/home`} /> : <LoginView />}
          ></Route>
          <Route element={<Layout />}>
            <Route
              path="/home"
              element={!stateAuth ? <Navigate to={`/login`} /> : <HomeView />}
            />
            <Route
              path="/generar"
              element={!stateAuth ? <Navigate to={`/login`} /> : <Generar />}
            />
            <Route
              path="/transferencia"
              element={
                !stateAuth ? <Navigate to={`/login`} /> : <Transferencia />
              }
            />
            <Route
              path="/historial"
              element={!stateAuth ? <Navigate to={`/login`} /> : <Historial />}
            />
            <Route
              path="/ubicacion"
              element={!stateAuth ? <Navigate to={`/login`} /> : <Ubicacion />}
            />
            <Route
              path="/transpallet"
              element={
                !stateAuth ? <Navigate to={`/login`} /> : <TransPallet />
              }
            />
            <Route
              path="/anular"
              element={!stateAuth ? <Navigate to={`/login`} /> : <Anularview />}
            />
            <Route
              path="/detallepallet"
              element={!stateAuth ? <Navigate to={`/login`} /> : <ScanDetallePallet />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
