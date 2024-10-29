import { Avatar, Popover, Button } from "@mui/material";
import React, { useState } from "react";
import "./style.css";

export default function Profile({ userProfile }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Avatar
        onClick={handleClick}
        style={{ background: "#fff", color: "#106BFD", cursor: "pointer" }}
      >
        <span className="avatar_text">{userProfile?.name[0]}</span>
      </Avatar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="popover_content">
          <div className="avatar_container">
            <Avatar className="profile_name">
              <span className="font_size">{userProfile?.name[0]}</span>
            </Avatar>
          </div>
          <span className="profile_text">{userProfile?.name}</span>
          <span className="profile_email">{userProfile?.email}</span>
          <div className="logout_container">
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              className="logout_btn"
            >
              Logout
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
