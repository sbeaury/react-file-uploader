import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

const ProgressBar = () => {
  return (
    <div className="progress-container">
      <h4 className="progress-bar-title">Uploading...</h4>
      <div className="progress-bar-container">
        <LinearProgress />
      </div>
    </div>
  );
};

export default ProgressBar;
