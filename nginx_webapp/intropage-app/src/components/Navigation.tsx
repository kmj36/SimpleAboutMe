import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Box, TextField, InputAdornment, Fade } from '@material-ui/core';
import { Search, Home, Assignment, Category, Face, DynamicFeed, Contacts } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const AppbarBanner = styled(Box)`
    display: flex;
    width: 100%;
    height: 60px;
    flex-Grow: 1;
    justify-content: center;
    align-items: center;
    background-color: #333D51;
    color: white;
`;

const SiteIcon = styled(Box)`
    display: flex;
    width: 30px;
    height: 50px;
    justify-content: center;
    align-items: center;
`;

const SiteTitle = styled(Box)`
    display: flex;
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
`;

function Navigation()
{
    const [value, setValue] = useState(0);
    const [pathicon, setPathicon] = useState(<Home/>);
    const [path, setPath] = useState(window.location.pathname);

    const Changehandle = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (path === "/") {
            setValue(0);
            setPathicon(<Home/>);
        } else if (path.startsWith("/post")) {
            setValue(1);
            setPathicon(<Assignment/>);
        } else if (path === "/categorize") {
            setValue(2);
            setPathicon(<Category/>);
        } else if (path === "/portfolio") {
            setValue(3);
            setPathicon(<DynamicFeed/>);
        } else if (path === "/about") {
            setValue(4);
            setPathicon(<Face/>);
        }
    }, [path]);

    return (
        <Fade in={true}>
            <AppBar position="relative" style={{ background: '#333D51', color: 'white' }}>
                <Box sx={{ display: "flex", flexDirection: "comuln"}}>
                    <AppbarBanner>
                        <SiteIcon>
                            {pathicon}
                        </SiteIcon>
                        <SiteTitle>
                            kmj36's Portfolio Site
                        </SiteTitle>
                    </AppbarBanner>
                    <Toolbar style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Tabs
                            value={value}
                            onChange={Changehandle}
                            variant="scrollable"
                            scrollButtons="auto"
                            TabIndicatorProps={{style: {backgroundColor: "#EF6C33"}}}
                        >
                            <Tab icon={<Home/>} value={0} label="Home" component={Link} to="/" />
                            <Tab icon={<Assignment/>} value={1} label="Blog" component={Link} to="/post" />
                            <Tab icon={<Category/>} value={2} label="Categorize" component={Link} to="/categorize" />
                            <Tab icon={<DynamicFeed/>} value={3} label="Portfolio" component={Link} to="/portfolio" />
                            <Tab icon={<Face/>} value={4} label="About" component={Link} to="/about" />
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
                </Box>
            </AppBar>
        </Fade>
    );
}

export default Navigation;