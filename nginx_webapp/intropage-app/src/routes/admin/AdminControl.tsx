import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { loading, done } from '../../redux/feature/LoadingReducer';
import { Divider, Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { Dashboard, Settings, Class, Create } from '@mui/icons-material';
import DashBoard from './DashBoard';
import Write from './Write'; 
import {Classfication} from './Classfication';
import {SettingsPage} from './SettingsPage';
import * as S from '../../styles/admin/AdminControl_Style';

function Control()
{
    const [menuNumber, setMenuNumber] = useState<number>(0);
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

    const dispatch = useAppDispatch();
    useEffect(() =>  {
        (async () => {
            dispatch(loading());
            dispatch(done());
        })();
    }, []);

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

export default Control;