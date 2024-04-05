import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      Home
      <Link to={'/post'}>
        <button>post가기</button>
      </Link>
    </div>
  );
}

export default Home;
