import { Box, Collapse, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import React from 'react'
import ListLink from './ListLink'
import { useState } from 'react'
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function GroupLink({ Icon, path, title, children }) {
    const [open, setOpen] = useState(false);
    const router = useLocation();
    const isActive = (children.filter((route) => route.path === router.pathname)[0] || router.pathname === path || open);

  return (
    <Box key={path}>
        <Stack direction="row" onClick={() => setOpen(!open)}>
            <ListItem
                className="my-1"
                key={path}
                disablePadding
            >
                <ListItemButton
                    component={NavLink}
                    to={path}
                    disableGutters
                >
                    <Stack direction="row"  flexGrow={1}>
                        {isActive && <FiberManualRecordIcon color="secondary" className='mt-2 mx-1' fontSize='12' />}
                        <Icon
                        color={isActive ? "secondary" : "primary"}
                        className={isActive ? "mt-0.5 me-3" : "mt-0.5 me-3 ms-4"}
                        />
                        <ListItemText primary={title} />
                        {open 
                            ? <ExpandLess className='mt-1 me-1' /> 
                            : <ExpandMore className='mt-1 me-1' />
                        }
                    </Stack>
                </ListItemButton>
            </ListItem>
        </Stack>

        <Collapse in={open} timeout="auto" unmountOnExit>
            <Box ml={2} borderLeft={1} borderColor="secondary.main">
                {children.map(
                    ({ path: subPath, icon: Icon, label: subLabel }) => (
                        <ListLink
                            key={subPath}
                            path={subPath}
                            Icon={Icon}
                            title={subLabel}
                        />
                    )
                )}
            </Box>
        </Collapse>
    </Box>
  )
}

export default GroupLink