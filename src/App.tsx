
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EditorLayout } from './components/EditorLayout';

import { Preview } from './components/Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<EditorLayout />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/" element={<Navigate to="/editor" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
