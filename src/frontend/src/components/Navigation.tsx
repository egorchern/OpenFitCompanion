import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink } from 'react-router-dom';
type Anchor = 'top' | 'left' | 'bottom' | 'right';
const navigablePages = ["Dashboard", "Profile", "Reports"]
const pageIconsMap: any = {
    "Dashboard": DashboardIcon,
    "Profile": AccountCircleIcon,
    "Reports": CalendarMonthIcon
}
const pagePathMap: any = {
    "Dashboard": "/",
    "Profile": "/profile",
    "Reports": "/reports"
}
function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const anchor = "left"
    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setIsOpen(open)
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {navigablePages.map((text, index) => {
                    const Icon = pageIconsMap[text]
                    const path = pagePathMap[text]
                    return (
                        <Link to={path}>
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        </Link>

                    )
                }

                )}
            </List>

        </Box>
    );

    return (
        <nav>

            <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>
                    <MenuIcon />
                </Button>
                <SwipeableDrawer
                    anchor={anchor}
                    open={isOpen}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                >
                    {list(anchor)}
                </SwipeableDrawer>
            </React.Fragment>

        </nav>
    );
}
export default Navigation