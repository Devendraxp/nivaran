import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import SignIn from './Pages/SignIn.jsx'
import ProfileWorker from './Pages/ProfileWorker.jsx'
import UpdateForm from './Pages/UpdateForm.jsx'
import Register from './Pages/RegisterWorker.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "worker",
        children: [
          {
            path: "sign-in",
            element: <SignIn />
          },
          {
            path: "profile",
            element: <ProfileWorker />
          },
          {
            path: "update",
            element: <UpdateForm />
          },
          {
            path: "register",
            element: <Register />
          }
        ]
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
