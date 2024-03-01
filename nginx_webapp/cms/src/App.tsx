import { Route, Routes } from 'react-router-dom';

import NotFound from './routes/errors/NotFound';
import AdminControl from './routes/AdminControl';

function App() {
  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<AdminControl/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
