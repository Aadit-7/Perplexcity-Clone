import { RouterProvider } from "react-router";
import { router } from "./app.router";

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
