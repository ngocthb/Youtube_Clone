import { Routes, Route } from "react-router-dom";
import { routes } from "./routes/index";

function App() {
  return (
    <>
      <Routes>
        {routes.map((route, index) => (
          <Route path="/" key={index} element={route.element}>
            {route.children.map((child, index) => (
              <Route key={index} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
      </Routes>
    </>
  );
}

export default App;
