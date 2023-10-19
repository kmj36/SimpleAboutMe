import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import NotFound from './routes/errors/NotFound';
import Home from './routes/Home';
import About from './routes/About';
import Portfolio from './routes/Portfolio';
import Blog from './routes/blogs/Blog';
import Page from './routes/blogs/Page';
import Search from './routes/blogs/Search';
import Categorize from './routes/blogs/Categorize';
import Controls from './routes/admin/AdminControl'

import Navigation from './components/Navigation';
import Loading from './components/Loading';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div id="App">
      <BrowserRouter>
        <Navigation />
        <Loading isload={loading}>
          <Routes>
            <Route path="/" element={<Home setLoading={setLoading} />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/post" element={<Blog setLoading={setLoading} />} />
            <Route path="/post/:pagenum" element={<Page />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categorize" element={<Categorize setLoading={setLoading} />} />
            <Route path="/controlpanel" element={<Controls />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Loading>
      </BrowserRouter>
    </div>
  );
}

export default App;
