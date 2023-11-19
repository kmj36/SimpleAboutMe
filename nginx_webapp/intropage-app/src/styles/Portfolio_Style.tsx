import styled from "styled-components";
import { Box, Typography, Button, Grid, Container } from "@mui/material";

export const PortfolioBox = styled(Box)`
`;

export const SectionBanner = styled(Box)`
`;

export const BannerBox = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 20rem;
    background-image: linear-gradient(to left, red, yellow);
    align-items: center;
    justify-content: center;
`;

export const BannerTypography = styled(Typography)`
`;

export const BannerTypographySubTitle = styled(Typography)`
`;

export const SectionMain = styled(Box)`
`;

export const ProjectsBox = styled(Box)`
`;

export const ContactBox = styled(Box)`
    width: 100%;
    padding-top: 80px;
    padding-bottom: 100px;
`;

export const ProjectBox = styled(Box)`

`;

export const ProjectImageBox = styled(Box)`
    display: flex;
    position: relative;
    height: 20rem;
    width: 40rem;
    border-radius: 10px;
`;

export const ProjectImage = styled.img`
    object-fit: cover;
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 10px;
`;

export const ImageOverlayGradient = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
    border-radius: 10px;
`;

export const ProjectDetail = styled(Box)`
    width: calc( 100% - 40px );
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 30px;
`;

export const ProjectDetailBox = styled(Box)`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    align-items: flex-end;
`;

export const ProjectDetailTitleTypography = styled(Typography)`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    color: white;
`;

export const ProjectDetailContentTypography = styled(Typography)`
    width: calc( 100% - 5px );
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    color: white;
    padding-left: 5px;
`;

export const FeaturedGrid = styled(Grid)`
    display: flex;
    justify-content: center;
`;

export const ContactTitle = styled(Box)`
    display: flex;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 30px;
`;

export const ContactTypography = styled(Typography)`
`;

export const ContactFormBox = styled(Box)`
`;

export const ContactEmailBox = styled(Box)`
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
`;

export const ContactNameBox = styled(Box)`
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
`;

export const ContactMessageBox = styled(Box)`
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
`;

export const ContactSubmitBox = styled(Box)`
    display: flex;
    justify-content: center;
`;

export const ContactSubmitButton = styled(Button)`
`;

export const ContactContainer = styled(Container)`
`;

export const ContactContainerBox = styled(Box)`

`;

export const SectionFeatured = styled(Box)`
    background-color: #f0f0f0;
    padding-top: 5rem;
    padding-bottom: 5rem;
`;

export const SectionContact = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export const FeaturedBox = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

export const FeaturedTitleBox = styled(Box)`
    padding-top: 20px;
`;

export const FeaturedTitleTypography = styled(Typography)`
`;

export const FeaturedProjectsBox = styled(Box)`
`;