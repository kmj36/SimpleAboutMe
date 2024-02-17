import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CallAPI, Posts_APIResponse, isPostsAPIResponse, Healthcheck_APIResponse, isHealthcheckAPIResponse, StatusInfo_APIResponse, isStatusInfoAPIResponse } from '../../funcs/CallAPI';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';


const DashBoardBox = styled(Box)`
`;

const ItemBox = styled(Box)`
    height: 345px;
`;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 5px;
`;

const Item = styled(Paper)`
    width: 100%;
    height: 100%;
`;

const Header = styled(Typography)`
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    font-weight: bold;
`;

const Image = styled.img`
    width: 100%;
    height: 150px;
    object-fit: cover;
`;

const TypographyContent = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
`;

const TypographyRanks = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

ChartJS.register(ArcElement);
ChartJS.register(Title);
ChartJS.register(Tooltip);
ChartJS.register(Legend);
ChartJS.register(CategoryScale);
ChartJS.register(LinearScale);
ChartJS.register(BarElement);

function DashBoard()
{
    const [postdata, setPostdata] = useState({} as Posts_APIResponse);
    const [healthdata, setHealthdata] = useState({} as Healthcheck_APIResponse);
    const [statusdata, setStatusdata] = useState({} as StatusInfo_APIResponse);

    const expression = /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);


    useEffect(() => {
        (async () => {
            const posts = await CallAPI({APIType:"PostList", Method:"GET", Query:"order=review"});
            const health = await CallAPI({APIType:"Healthcheck", Method:"GET"});
            const status = await CallAPI({APIType:"StatusInfo", Method:"GET"});
            if(isHealthcheckAPIResponse(health))
                setHealthdata(health);
            if(isStatusInfoAPIResponse(status))
                setStatusdata(status);
            if(isPostsAPIResponse(posts))
                setPostdata(posts); 
        })();
    }, []);

    return(
        <DashBoardBox>
            <Grid container>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>인기글</Header>
                                <Image src={postdata?.posts?.at(0) && regex.test(postdata.posts[0].thumbnailurl) ? postdata.posts[0].thumbnailurl : "No_Image.jpg"}/>
                                <Typography variant='subtitle1'>조회수: {postdata?.posts?.at(0)?.views}</Typography>
                                <Typography variant='h5'>
                                    <Link to={`/post/${postdata?.posts?.at(0)?.postid}`} style={useMemo(()=>({ textDecoration: 'none', color: 'black' }), [])}>
                                        {postdata?.posts?.at(0)?.title}
                                    </Link>
                                </Typography>
                                <TypographyContent variant='subtitle1'>{postdata?.posts?.at(0)?.content}</TypographyContent>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>조회수 Top10</Header>
                                <TypographyRanks variant='subtitle2'>1: [{postdata?.posts?.at(0)?.views}] - {postdata?.posts?.at(0)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>2: [{postdata?.posts?.at(1)?.views}] - {postdata?.posts?.at(1)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>3: [{postdata?.posts?.at(2)?.views}] - {postdata?.posts?.at(2)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>4: [{postdata?.posts?.at(3)?.views}] - {postdata?.posts?.at(3)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>5: [{postdata?.posts?.at(4)?.views}] - {postdata?.posts?.at(4)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>6: [{postdata?.posts?.at(5)?.views}] - {postdata?.posts?.at(5)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>7: [{postdata?.posts?.at(6)?.views}] - {postdata?.posts?.at(6)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>8: [{postdata?.posts?.at(7)?.views}] - {postdata?.posts?.at(7)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>9: [{postdata?.posts?.at(8)?.views}] - {postdata?.posts?.at(8)?.title}</TypographyRanks>
                                <TypographyRanks variant='subtitle2'>10: [{postdata?.posts?.at(9)?.views}] - {postdata?.posts?.at(9)?.title}</TypographyRanks>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>API 상태체크</Header>
                                <Typography variant='subtitle1'>{healthdata?.['Cache backend: default'] === "working" ? '✅' : '❌' } Cache backend: default {healthdata?.['Cache backend: default']}</Typography>
                                <Typography variant='subtitle1'>{healthdata?.DatabaseBackend === "working" ? '✅' : '❌' } DatabaseBackend : {healthdata?.DatabaseBackend}</Typography>
                                <Typography variant='subtitle1'>{healthdata?.DefaultFileStorageHealthCheck === "working" ? '✅' : '❌' } DefaultFileStorageHealthCheck : {healthdata?.DefaultFileStorageHealthCheck}</Typography>
                                <Typography variant='subtitle1'>{healthdata?.MigrationsHealthCheck === "working" ? '✅' : '❌' } MigrationsHealthCheck : {healthdata?.MigrationsHealthCheck}</Typography>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>컨트롤 기록 (예정)</Header>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Grid container>
                                    {statusdata?.server?.cpu?.map((item, index) => {
                                        return(
                                            <Grid item xs={6} sm={6} md={6}>
                                                <Doughnut data={{
                                                    labels: ['사용중', '사용가능'],
                                                    datasets: [{
                                                        data: [item, 100 - item],
                                                        backgroundColor: [
                                                            'rgb(255, 99, 132)',
                                                            'rgb(54, 162, 235)',
                                                            'rgb(255, 205, 86)'
                                                        ],
                                                    }]
                                                }} options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            display: false,
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: `CPU ${index}`,
                                                        }
                                                    }
                                                }}/>
                                            </Grid>
                                        );
                                        }
                                    )}
                                </Grid>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>Memory</Header>
                                <Typography variant='subtitle1'>{healthdata?.MemoryUsage === "working" ? '✅' : '❌' } MemoryUsage {healthdata?.MemoryUsage}</Typography>
                                <Grid container>
                                    <Grid item xs={6} sm={6} md={6}>
                                        <Doughnut data={{
                                            labels: ['사용중', '사용가능'],
                                            datasets: [{
                                                data: [statusdata?.server?.memory[0], 100 - statusdata?.server?.memory[0]],
                                                backgroundColor: [
                                                    'rgb(255, 99, 132)',
                                                    'rgb(54, 162, 235)',
                                                    'rgb(255, 205, 86)'
                                                ],
                                            }]
                                        }} options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                title: {
                                                    display: true,
                                                    text: `Memory Virtual`,
                                                }
                                            }
                                        }}/>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6}>
                                        <Doughnut data={{
                                            labels: ['사용중', '사용가능'],
                                            datasets: [{
                                                data: [statusdata?.server?.memory[1], 100 - statusdata?.server?.memory[1]],
                                                backgroundColor: [
                                                    'rgb(255, 99, 132)',
                                                    'rgb(54, 162, 235)',
                                                    'rgb(255, 205, 86)'
                                                ],
                                            }]
                                        }} options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                title: {
                                                    display: true,
                                                    text: `Memory Swap`,
                                                }
                                            }
                                        }}/>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>Disk</Header>
                                <Typography variant='subtitle1'>{healthdata?.DiskUsage === "working" ? '✅' : '❌' } DiskUsage {healthdata?.DiskUsage}</Typography>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Doughnut data={{
                                            labels: ['사용중', '사용가능'],
                                            datasets: [{
                                                data: [statusdata?.server?.disk, 100 - statusdata?.server?.disk],
                                                backgroundColor: [
                                                    'rgb(255, 99, 132)',
                                                    'rgb(54, 162, 235)',
                                                    'rgb(255, 205, 86)'
                                                ],
                                            }]
                                        }} options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                title: {
                                                    display: true,
                                                    text: `disk`,
                                                }
                                            }
                                        }}/>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ItemBox>
                        <Wrapper>
                            <Item>
                                <Header variant='h5'>Network</Header>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Bar data={{
                                            labels: [`IN ${statusdata?.server?.network[0]} MB/s`, `OUT ${statusdata?.server?.network[1]} MB/s`],
                                            datasets: [{
                                                label: 'Network',
                                                data: [statusdata?.server?.network[0], statusdata?.server?.network[1]],
                                                backgroundColor: [
                                                    'rgb(255, 99, 132)',
                                                    'rgb(54, 162, 235)',
                                                    'rgb(255, 205, 86)'
                                                ],
                                                borderColor: [
                                                    'rgb(255, 99, 132)',
                                                    'rgb(54, 162, 235)',
                                                    'rgb(255, 205, 86)'
                                                ],
                                                borderWidth: 1,
                                            }]
                                        }}/>
                                    </Grid>
                                </Grid>
                            </Item>
                        </Wrapper>
                    </ItemBox>
                </Grid>
            </Grid>
        </DashBoardBox>
    );
}

export default DashBoard;