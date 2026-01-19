import React from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const App = () => {
  return (
    <div>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Here is a gentle confirmation that your action was successful.
      </Alert>
    </div>
  );
};

export default App;
