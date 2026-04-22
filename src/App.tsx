import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Portfolio from '@/pages/Portfolio';
import Calculator from '@/pages/Calculator';
import Guide from '@/pages/Guide';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
