import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Box, TextField, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React from 'react';

function Navigation()
{
    const [value, setValue] = React.useState(0);

    const Changehandle = (event: React.ChangeEvent<{}>, newValue: number) => {
        if(newValue !== undefined)
            setValue(newValue);
        console.log(newValue);
    };

    return (
        <Box id="nav" style={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: '#333D51', color: 'white' }}>
                <Toolbar style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Tabs value={value} onChange={Changehandle} variant="scrollable" scrollButtons="off" TabIndicatorProps={{style: {backgroundColor: "#EF6C33"}}}>
                        <Tab label="Home" component={Link} to="/" />
                        <Tab label="Blog" component={Link} to="/post" />
                        <Tab label="Categorize" component={Link} to="/categorize" />
                        <Tab label="About" component={Link} to="/about" />
                        <Tab label="Portfolio" component={Link} to="/portfolio" />
                        <Tab label="Contact" component={Link} to="/contact" />
                    </Tabs>
                    <Box>
                        <TextField
                            id="input-with-icon-textfield"
                            placeholder="Search"
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <Search style={{ color: "white" }}/>
                                </InputAdornment>
                            ),
                            style: { color: "white"}
                            }}
                            variant="standard"
                        />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navigation;