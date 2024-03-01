import * as S from '../styles/Classfication_Style'
import { Button, ButtonGroup } from '@mui/material';
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CallAPI, Categories_APIResponse, isCategoriesAPIResponse, Tags_APIResponse, isTagsAPIResponse } from '../funcs/CallAPI';
import { useEffect, useState } from 'react';

function Classfication()
{
    const [listnumber, setListNumber] = useState(0);
    const [Categories, setCategories] = useState({} as Categories_APIResponse);
    const [Tags, setTags] = useState({} as Tags_APIResponse);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGetCategories = () => {
        (async () => {
            const res = await CallAPI({APIType: "CategoryList", Method: "GET"});
            if(isCategoriesAPIResponse(res))
                setCategories(res);
        })();
        setListNumber(0);
    }

    const handleGetTags = () => {
        (async () => {
            const res = await CallAPI({APIType: "TagList", Method: "GET"});
            if(isTagsAPIResponse(res))
                setTags(res);
        })();
        setListNumber(1);
    }

    const Titles = [
        "Categories",
        "Tags"
    ];

    const Categorycolumns : GridColDef[] = [
        { field: 'categoryid', headerName: 'ID', width: 250 },
        { field: 'categorydescription', headerName: 'Description', width: 250 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'updated_at', headerName: 'Updated At', width: 200 },
        { field: 'userid', headerName: 'User ID', width: 200 },
    ];

    const Tagcolumns : GridColDef[] = [
        { field: 'tagid', headerName: 'ID', width: 250 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'updated_at', headerName: 'Updated At', width: 200 },
        { field: 'userid', headerName: 'User ID', width: 200 },
    ];

    useEffect(() => {
        handleGetTags();
        handleGetCategories();
    }, []);
    
    return (
        <S.ClassficationBox>
            <S.ClassficationList>
                <ButtonGroup variant="text" aria-label="Classfication Group" orientation="vertical" size="large" color="primary">
                    <Button onClick={handleGetCategories}><Typography variant="h5">Categories</Typography></Button>
                    <Button onClick={handleGetTags}><Typography variant="h5">Tags</Typography></Button>
                </ButtonGroup>
            </S.ClassficationList>
            <S.ClassficationMain>
                <S.ClassficationCreateBox>
                    <S.ClassficationTitle variant="h5">{Titles[listnumber]}</S.ClassficationTitle>
                    <Button onClick={handleClickOpen} variant="contained" sx={{marginLeft: 2}}>Create {Titles[listnumber]}</Button>
                </S.ClassficationCreateBox>
                <S.ClassficationTableBox>
                    <S.ClassficationTableTitle variant="subtitle1">검색 수 : {listnumber === 0 ? Categories?.categories?.length : Tags?.tags?.length} 개</S.ClassficationTableTitle>
                    <S.ClassficationTableItemBox>
                        <DataGrid
                            rows={listnumber === 0 ? (Categories?.categories?.length > 0 ? Categories.categories : []) : (Tags?.tags?.length > 0 ? Tags.tags : [])}
                            columns={listnumber === 0 ? Categorycolumns : Tagcolumns}
                            getRowId={(row) => (listnumber === 0 ? row.categoryid : row.tagid)}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                    pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10]}
                            checkboxSelection
                            disableRowSelectionOnClick
                            style={{ marginTop: 10 }}
                         />
                    </S.ClassficationTableItemBox>
                </S.ClassficationTableBox>
            </S.ClassficationMain>
            <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries((formData as any).entries());
                if(listnumber === 0)
                {
                    (async () => {
                        const res = await CallAPI({APIType: "CategoryList", Method: "POST", Body: formJson});
                        if(isCategoriesAPIResponse(res))
                            setCategories(res);
                        handleGetCategories();
                    })();
                }
                else
                {
                    (async () => {
                        const res = await CallAPI({APIType: "TagList", Method: "POST", Body: formJson});
                        if(isTagsAPIResponse(res))
                            setTags(res);
                        handleGetTags();
                    })();
                }
                handleClose();
            },
            }}
        >
            <DialogTitle>Create {Titles[listnumber]}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the {Titles[listnumber]} you want to create.
                </DialogContentText>
                    {listnumber === 0 ? 
                    <div>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="categoryid"
                            name="categoryid"
                            label={"Input "+Titles[listnumber]}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="categorydescription"
                            name="categorydescription"
                            label={"Input "+Titles[listnumber] + " Description"}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </div>
                    :
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="tagid"
                        name="tagid"
                        label={"Input "+Titles[listnumber]}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Create</Button>
            </DialogActions>
        </Dialog>
        </S.ClassficationBox>
    );
}
export default Classfication;