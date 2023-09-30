import { BrowserRouter, Route, Routes  } from 'react-router-dom';
import { Container } from '@material-ui/core';

import NotFound from './routes/errors/NotFound';
import Home from './routes/Home';
import About from './routes/AboutMe';
import Contact from './routes/Contact';
import Portfolio from './routes/Portfolio';
import Blog from './routes/blogs/Blog';
import Page from './routes/blogs/Page';
import Search from './routes/blogs/Search';
import Categorize from './routes/blogs/Categorize';
import Controls from './routes/admin/AdminControl'

import styled from 'styled-components';
import Navigation from './components/Navigation';


function App() {
  return (
    <div id="App">
      <BrowserRouter>
        <Navigation/>
        <Container>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/portfolio" element={<Portfolio/>} />
            <Route path="/post" element={<Blog/>}/>
            <Route path="/post/:pagenum" element={<Page/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/categorize" element={<Categorize/>}/>
            <Route path="/controlpanel" element={<Controls/>}/>
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
