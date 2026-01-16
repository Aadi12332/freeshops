/** @format */

import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const TrackRoute = ({ pageName, setSort, sort }) => {
  return (
    <>
      <div className="trackroute-container">
        <div className="trackroute-left">
          <Link to={"/"} className="link">
            <span>Home</span>
          </Link>
          <IoIosArrowForward />
          <h6>{pageName}</h6>
        </div>
        <div className="trackroute-right">
          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value={""}> Sort By : </option>
            <option value={"oldest"}>  Oldest First </option>
            <option value={"newest"}>Recent First </option>
          </select>
        </div>
      </div>
    </>
  );
};

export default TrackRoute;
