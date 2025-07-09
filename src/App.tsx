import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogsGrid from "./pages/BlogsGrid";
import BlogDetails from "./pages/BlogDetails";
import UploadNotes from "./pages/UploadNotes";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsGrid />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/upload" element={<UploadNotes />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
