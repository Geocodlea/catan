"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  Avatar,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

const NavItem = ({ name, link }) => {
  return (
    <Link href={link}>
      <ListItem sx={{ paddingY: 0 }}>
        <ListItemButton
          className="btn"
          sx={{
            textAlign: "center",
          }}
        >
          <ListItemText
            primary={name.charAt(0).toUpperCase() + name.slice(1)}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

const NavItems = ({
  item,
  openMenu,
  handleOpenMenu,
  handleCloseMenu,
  anchorEl,
}) => {
  const { data: session, status } = useSession();

  let link;
  let name;
  switch (item) {
    case "home":
      link = "/";
      name = item;
      break;
    case "login":
      if (status === "loading") return "Login";
      link = !session ? "/api/auth/signin" : null;
      name = !session ? item : null;
      break;
    default:
      link = `/${item}`;
      name = item;
  }

  if (link) return <NavItem key={item} name={name} link={link} />;
  else
    return (
      <ListItem key={item} disablePadding>
        <ListItemButton
          onClick={handleOpenMenu}
          sx={{
            justifyContent: "center",
          }}
        >
          <Avatar
            alt="avatar"
            src={session?.user.image ? session.user.image : "/img/avatar.png"}
          />
        </ListItemButton>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom", // Align menu's top to the bottom of the button
            horizontal: "center", // Center horizontally with the button
          }}
          transformOrigin={{
            vertical: "top", // Align menu's top with its own top
            horizontal: "center", // Center horizontally with its own center
          }}
        >
          {session.user.role === "admin" && (
            <Link href="/admin">
              <MenuItem onClick={handleCloseMenu}>Admin</MenuItem>
            </Link>
          )}
          {session.user.role === "organizer" && (
            <Link href="/organizer">
              <MenuItem onClick={handleCloseMenu}>Organizator</MenuItem>
            </Link>
          )}
          <Link href="/profile">
            <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
          </Link>
          <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
        </Menu>
      </ListItem>
    );
};

export default NavItems;
