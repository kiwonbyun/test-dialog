import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Post from './page/Post';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post" element={<Post />} />
    </Routes>
  );
}

export default App;
