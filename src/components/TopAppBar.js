import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function TopAppBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography component="h1" variant="h4">
                    Watchify
                </Typography>
            </Toolbar>
        </AppBar>
    )
}