import * as S from '../../styles/admin/Classfication_Style'
import { Button, ButtonGroup } from '@mui/material';
import { Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, InputBase, Paper } from '@mui/material';
import { CallAPI, Categories_APIResponse, isCategoriesAPIResponse, Tags_APIResponse, isTagsAPIResponse } from '../../funcs/CallAPI';
import { useEffect, useState } from 'react';

function Classfication()
{
    const [listnumber, setListNumber] = useState(0);
    const [Categories, setCategories] = useState({} as Categories_APIResponse);
    const [Tags, setTags] = useState({} as Tags_APIResponse);

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
        { field: 'tagdescription', headerName: 'Description', width: 250 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'updated_at', headerName: 'Updated At', width: 200 },
        { field: 'userid', headerName: 'User ID', width: 200 },
    ];

    useEffect(() => {
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
                <S.ClassficationTitle variant="h5">{Titles[listnumber]}</S.ClassficationTitle>
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
        </S.ClassficationBox>
    );
}
export default Classfication;