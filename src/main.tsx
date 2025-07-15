import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initIhfOverrides } from './utils/ihfOverrides'

initIhfOverrides()

createRoot(document.getElementById("root")!).render(<App />);
