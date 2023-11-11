import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Box, TextField, InputAdornment, Fade } from '@material-ui/core';
import { Search, Home, Assignment, Category, Face, DynamicFeed, Contacts } from '@material-ui/icons';
import { useEffect, useState, useRef } from 'react';
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
    const SearchRef = useRef<HTMLInputElement | null>(null);
    const [value, setValue] = useState(0);
    const [pathicon, setPathicon] = useState(<Home/>);
    const [path, setPath] = useState(window.location.pathname);

    const Changehandle = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleOnSearchEnter = (e : any) => {
        if(e.keyCode===13)
        {
            var query = "";
            const inputtitle = SearchRef?.current?.value;
            if (typeof inputtitle == 'string')
                query += `t=${encodeURIComponent(inputtitle)}&`;
            
            window.location.replace(`/search?${query}`);
        }
    }

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
        }
    }, [path]);

    return (
        <Fade in={true}>
            <AppBar position="relative" style={{ background: '#333D51', color: 'white' }}>
                <Box sx={{ display: "flex", flexDirection: "comuln"}}>
                    <AppbarBanner>
                        <Link to='/' style={{ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <SiteIcon>
                                {pathicon}
                            </SiteIcon>
                            <SiteTitle>
                                PortLog
                            </SiteTitle>
                        </Link>
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
                        </Tabs>
                        <Box>
                            <TextField
                                id="input-with-icon-textfield"
                                placeholder="Search"
                                inputRef={SearchRef}
                                onKeyDown={handleOnSearchEnter}
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