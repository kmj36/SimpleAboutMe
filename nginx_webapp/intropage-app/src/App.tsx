import { Route, Routes } from 'react-router-dom';

import NotFound from './routes/errors/NotFound';
import Home from './routes/Home';
import Portfolio from './routes/Portfolio';
import Blog from './routes/blogs/Blog';
import Page from './routes/blogs/Page';
import Search from './routes/blogs/Search';
import Categorize from './routes/blogs/Categorize';
import Controls from './routes/admin/AdminControl'

import Navigation from './components/Navigation';
import Footer from './components/Footer';

function App() {
  return (
    <div id="App">
      <Navigation/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/post" element={<Blog/>} />
        <Route path="/post/:pagestr" element={<Page />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categorize" element={<Categorize/>} />
        <Route path="/controlpanel" element={<Controls />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
