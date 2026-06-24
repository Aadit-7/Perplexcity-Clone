import { RouterProvider } from "react-router";
import { router } from "./app.route";
import { useAuth } from "./features/auth/hook/useAuth";
import { useEffect } from "react";

const App = () => {
  const auth = useAuth();

  useEffect(() => {
    auth.handleGetMe();
  }, []);

  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
