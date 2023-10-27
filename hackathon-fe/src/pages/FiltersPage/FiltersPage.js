import React from "react";
import Filters from "../../components/Filters/Filters";
import { useLocation } from "react-router-dom";

const FiltersPage = () => {
  const location = useLocation();
  return <Filters friend={location.state?.friend} />;
};

export default FiltersPage;
