import { Route, Routes } from 'react-router-dom';

import NotFound from './routes/errors/NotFound';
import Home from './routes/Home';
import Portfolio from './routes/Portfolio';
import Blog from './routes/Blog';
import Page from './routes/Page';
import Search from './routes/Search';
import Categorize from './routes/Categorize';

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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
