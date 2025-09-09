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
					<strong>V.E.R.A</strong> é um acrônimo para "Valor Efetivo de Renda
					Analisada". O serviço processa a renda e tempo de trabalho de um
					profissional para embasar análises de crédito, oferecendo uma API
					RESTful robusta para gerenciamento de registros de funcionários com
					cálculos automáticos de salário e análise de tempo de serviço.
				</p>

				<Button
					size="lg"
					onClick={handleNavigateToRegistros}
					className="text-lg px-8 py-4"
				>
					Acessar Registros
				</Button>
			</div>
		</div>
	);
}

export default Home;
