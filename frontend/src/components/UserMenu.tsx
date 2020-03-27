import React from "react";
import { Button, Menu, MenuItem, Avatar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { createInfoToast } from "features/toast/ToastSlice";
import { logout } from "features/auth/AuthSlice";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { avatarStyles } from "styles";

const Username = styled.div`
  color: #333;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  &:focus {
    outline: none;
  }
`;

const UserMenu = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotImplemented = () => {
    dispatch(createInfoToast("Not implemented yet 😟"));
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
  };

  return (
    <>
      <Button
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleClick}
        css={css`
          min-width: 1.5rem;
          padding: 0;
          border-radius: 50%;
          &:hover {
            background-color: initial;
          }
        `}
      >
        <Avatar css={avatarStyles}>{user?.username.charAt(0)}</Avatar>
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transitionDuration={0}
        keepMounted
      >
        <Username>{user?.username}</Username>
        <MenuItem onClick={handleNotImplemented}>Profile</MenuItem>
        <MenuItem onClick={handleNotImplemented}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
