import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />

      <div id="mainContainer" className="pt-3">
        <Outlet />
      </div>
    </>
  );
}
