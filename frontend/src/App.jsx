import {
  RouterProvider,
} from "react-router";
import routes from "./router/routes";
import '@/theme/app.css'


function App() {
  return (
    <RouterProvider router={routes} />
  )
}

export default App
