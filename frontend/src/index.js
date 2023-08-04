import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { ResultContextProvider } from "./context/ResultContext"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "react-toastify/dist/ReactToastify.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  //<React.StrictMode>
  <ResultContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ResultContextProvider>
  //</React.StrictMode>
)
