"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import NavItems from "./NavItems";

const drawerWidth = 240;
const navItems = ["home", "login"];

function DrawerAppBar({ windowAppBar }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    event.stopPropagation(); // solutin to padding-right to the body
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = (event) => {
    event.stopPropagation(); // solutin to padding-right to the body
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ fontSize: 0 }}>
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={70} height={70} />
        </Link>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <NavItems
            key={item}
            item={item}
            openMenu={openMenu}
            handleOpenMenu={handleOpenMenu}
            handleCloseMenu={handleCloseMenu}
            anchorEl={anchorEl}
          />
        ))}
      </List>
    </Box>
  );

  const container =
    windowAppBar !== undefined ? () => window().document.body : undefined;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight * 0.4) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const appBarStyle = {
    background: isScrolled ? "var(--main-gradient)" : "transparent",
    transition: "background 0.3s",
    padding: "6px 16px",
    boxShadow: isScrolled
      ? "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
      : "none",
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar id="appBar" component="nav" style={appBarStyle}>
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              fontSize: 0,
            }}
          >
            <Link href="/">
              <Image
                src="/logo_white.svg"
                alt="Logo"
                width={70}
                height={70}
                priority
              />
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <NavItems
                key={item}
                item={item}
                openMenu={openMenu}
                handleOpenMenu={handleOpenMenu}
                handleCloseMenu={handleCloseMenu}
                anchorEl={anchorEl}
              />
            ))}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: "auto", display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "grey.200",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default DrawerAppBar;
