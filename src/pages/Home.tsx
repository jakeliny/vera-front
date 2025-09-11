import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Home() {
	const navigate = useNavigate();

	const handleNavigateToRegistros = () => {
		navigate("/registros");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-4xl mx-auto text-center px-6">
				<h1 className="text-6xl font-bold text-gray-900 mb-6">V.E.R.A</h1>

				<p className="text-xl text-gray-600 mb-12 leading-relaxed">
					<strong>V.E.R.A</strong> is an acronym for "Value Effective Revenue
					Analyzed". The service processes income and work time of a
					professional to support credit analysis, offering a robust RESTful API
					for employee record management with automatic salary calculations and
					service time analysis.
				</p>

				<Button
					size="lg"
					onClick={handleNavigateToRegistros}
					className="text-lg px-8 py-4"
				>
					Access Records
				</Button>
			</div>
		</div>
	);
}

export default Home;
