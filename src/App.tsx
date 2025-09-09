import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registros from "./pages/Registros";
import RegistroDetails from "./pages/RegistroDetails";
import { Toaster } from "@/components/ui/sonner";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/registros" element={<Registros />} />
				<Route path="/registros/:id" element={<RegistroDetails />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
