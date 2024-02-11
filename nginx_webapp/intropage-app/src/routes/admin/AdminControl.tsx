import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { loading, done } from '../../redux/feature/LoadingReducer';
import { Divider, Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Typography, TextField } from '@material-ui/core';
import { Button } from '@mui/material';
import { Dashboard, Settings, Class, Create } from '@mui/icons-material';
import DashBoard from './DashBoard';
import Write from './Write'; 
import {Classfication} from './Classfication';
import {SettingsPage} from './SettingsPage';
import * as S from '../../styles/admin/AdminControl_Style';
import { CallAPI, Login_APIResponse } from '../../funcs/CallAPI';
import {SHA256} from "crypto-js";

function Control()
{
    const [menuNumber, setMenuNumber] = useState<number>(0);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [ID, setID] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    
    const Menus : JSX.Element[] = [
        <DashBoard />,
        <Write />,
        <Classfication />,
        <SettingsPage />
    ];
    const MenuTitles : String[] = [
        "DashBoard",
        "Write",
        "Classification",
        "Settings"
    ];
    const ChangeMenu = (num : number) => {
        if(menuNumber === num)
            return;
        if(num>=0)
            setMenuNumber(num);
    };
    const handleLogin = (e : any) => {
        if(e.key !== undefined && e.key !== "Enter")
            return;
        (async () => {
            const login = await CallAPI({APIType:"Login", Method:"POST", Body:{
                'userid' : ID,
                'password' : SHA256(Password).toString()
            }}) as Login_APIResponse;
            if(login.token !== undefined)
                window.location.reload();
            else
                alert("관리자 로그인에 실패하였습니다. 다시 시도해주세요.");
        })();
    }

    const dispatch = useAppDispatch() as any;
    useEffect(() =>  {
        (async () => {
            dispatch(loading());

            const auth = await CallAPI({APIType:"Auth", Method:"POST"});
            if(Object.keys(auth).length !== 0)
            {
                alert("관리자 로그인이 필요합니다.");
                dispatch(done());
                return;
            }
            
            setIsAuth(true);

            dispatch(done());
        })();
    }, [dispatch]);

    if(!isAuth)
    {
        return (
            <S.LoginBox onKeyDown={handleLogin}>
                <S.BackgroundCover>
                    <S.Panel>
                        <S.PanelWrapper>
                            <Typography variant="h4">Login</Typography>
                            <TextField id="IDBox" value={ID} label="ID" onChange={(e : React.ChangeEvent<HTMLTextAreaElement>)=>setID(e.currentTarget.value)} variant="outlined" style={{width: '100%', marginTop: '20px'}}/>
                            <TextField id="PasswordBox" value={Password} onChange={(e : React.ChangeEvent<HTMLTextAreaElement>)=>setPassword(e.currentTarget.value)} label="Password" type="password" variant="outlined" style={{width: '100%', marginTop: '20px'}}/>
                            <Button variant="contained" onClick={handleLogin} style={{marginTop: '10px'}}><Typography>Enter</Typography></Button>
                        </S.PanelWrapper>
                    </S.Panel>
                </S.BackgroundCover>
            </S.LoginBox>
        );
    }else
    {
        return (
            <S.ControlBox>
                <S.LeftBarBox>
                    <S.BarWrapper>
                        <Paper>
                            <MenuList>
                                <MenuItem onClick={() => ChangeMenu(0)}>
                                    <ListItemIcon>
                                        <Dashboard fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>DashBoard</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => ChangeMenu(1)}>
                                    <ListItemIcon>
                                        <Create fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Write</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => ChangeMenu(2)}>
                                    <ListItemIcon>
                                        <Class fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Classification</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => ChangeMenu(3)}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Settings</ListItemText>
                                </MenuItem>
                            </MenuList>
                        </Paper>
                    </S.BarWrapper>
                </S.LeftBarBox>
                <Divider flexItem orientation="vertical"/>
                <S.BoardBox>
                    <S.TopTitleBar>
                        <S.TopTitleTypography variant="h4">
                            {MenuTitles[menuNumber]}
                        </S.TopTitleTypography>
                    </S.TopTitleBar>
                    <S.BoardMainBox>
                        {Menus[menuNumber]}
                    </S.BoardMainBox>
                </S.BoardBox>
            </S.ControlBox>
        );
    }
}

export default Control;