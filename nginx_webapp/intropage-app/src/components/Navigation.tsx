import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Box, TextField, InputAdornment } from '@material-ui/core';
import { Search, Home, Assignment, Category, DynamicFeed } from '@material-ui/icons';
import { useState, useRef, useCallback, useMemo } from 'react';
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

const SiteTitle = styled(Box)`
    display: flex;
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
`;

function Navigation()
{
    const SearchRef = useRef<HTMLInputElement | null>(null);
    const [value, setValue] = useState(useCallback(()=>{
        if(window.location.pathname === "/")
            return 0;
        else if(window.location.pathname === "/post")
            return 1;
        else if(window.location.pathname === "/categorize")
            return 2;
        else if(window.location.pathname === "/portfolio")
            return 3;
        else
            return 0;
    }, []));

    const Changehandle : ((event: React.ChangeEvent<{}>, value: any) => void) = useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    }, []);

    const handleOnSearchEnter : React.KeyboardEventHandler<HTMLDivElement> = useCallback((event : React.KeyboardEvent<HTMLDivElement>) => {
        if(event.key === 'Enter')
        {
            var query = "";
            const inputtitle = SearchRef?.current?.value;
            if (typeof inputtitle == 'string')
                query += `t=${encodeURIComponent(inputtitle)}&`;
            
            window.location.replace(`/search?${query}`);
        }
    }, []);

    return (
        <AppBar position="relative" style={useMemo(() => ({ background: '#333D51', color: 'white' }), [])}>
            <Box sx={useMemo(() =>({ display: "flex", flexDirection: "column"}), [])}>
                <AppbarBanner>
                    <Link to='/' style={useMemo(() => ({ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center'}), [])}>
                        <SiteTitle>
                            PortLog
                        </SiteTitle>
                    </Link>
                </AppbarBanner>
                <Toolbar style={useMemo(() => ({ flexDirection: 'row', justifyContent: 'space-around' }), [])}>
                    <Tabs
                        value={value}
                        onChange={Changehandle}
                        variant="scrollable"
                        scrollButtons="auto"
                        TabIndicatorProps={useMemo(() => ({style: {backgroundColor: "#EF6C33"}}), [])}
                    >
                        <Tab icon={useMemo(() => <Home/>, [])} value={0} label="Home" component={Link} to="/" />
                        <Tab icon={useMemo(() => <Assignment/>, [])} value={1} label="Blog" component={Link} to="/post" />
                        <Tab icon={useMemo(() => <Category/>, [])} value={2} label="Categorize" component={Link} to="/categorize" />
                        <Tab icon={useMemo(() => <DynamicFeed/>, [])} value={3} label="Portfolio" component={Link} to="/portfolio" />
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
    );
}

export default Navigation;