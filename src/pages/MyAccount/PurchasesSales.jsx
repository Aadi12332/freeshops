import React, { useState, useEffect, useCallback } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { BiLoaderCircle } from "react-icons/bi";
import Transactions from "./Transactions";

const PurchasesSales = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(() => {
    setIsLoading(true);
    getApi(endPoints.account.getDashboard(), {
      setResponse: (data) => {
        setDashboardData(data.data);
        setIsLoading(false);
      },
      setError: (err) => {
        console.error(err);
        setIsLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading) {
    return <div className="loading_container"><BiLoaderCircle className="spinner" /></div>;
  }

  return (
    <div className="stats_grid">
      {dashboardData ? (
        <>
          <div className="stat_card">
            <p className="stat_value">{dashboardData.post}</p>
            <p className="stat_label">Posts</p>
          </div>
          <div className="stat_card">
            <p className="stat_value">{dashboardData.view}</p>
            <p className="stat_label">Views</p>
          </div>
          <div className="stat_card">
            <p className="stat_value">{dashboardData.sold}</p>
            <p className="stat_label">Sold</p>
          </div>

        </>
      ) : (
        <p>Could not load data.</p>
      )}
    </div>
  );
};

export default PurchasesSales;