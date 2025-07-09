import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogsGridPage from "./pages/BlogsGridPage";
import BlogDetails from "./pages/BlogDetails";
import UploadNotes from "./pages/UploadNotes";
import About from "./pages/About";
import LeaderboardPage from "./pages/LeaderboardPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsGridPage />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
