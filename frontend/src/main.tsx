import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import 'handsontable/dist/handsontable.full.min.css';


createRoot(document.getElementById("root")!).render(<App />);
