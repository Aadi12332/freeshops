/** @format */

import { useEffect, useState } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import styles from "../../css/explore.module.css";
import { useNavigate } from "react-router-dom";

const BrowseList = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);

  const fetchAllCategories = () => {
    getApi(endPoints.getCategories, {
      setResponse,
      showErr: false,
    });
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div className="container py-2 min-h-screen">
      <h1 className={styles.headline}>Browse</h1>
      <div className={styles.list_container}>
        {response?.data?.map((item) => (
          <p
            key={item?._id}
            className={styles.browse_item}
            onClick={() => navigate(`/category/${item?.name}?id=${item?._id}`)}
          >
            {item?.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BrowseList;
