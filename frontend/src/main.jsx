import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Home from './components/Pages/Home.jsx'
import SignIn from './components/Pages/SignIn.jsx'
import ProfileWorker from './components/Pages/ProfileWorker.jsx'
import UpdateForm from './components/Pages/UpdateForm.jsx'
import Register from './components/Pages/RegisterWorker.jsx'

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
