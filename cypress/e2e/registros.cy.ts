describe("Registros Management", () => {
	const testEmployee = `Test Employee ${Date.now()}`;
	const testSalary = 5000;
	const testDate = new Date().toISOString().split("T")[0];
	let recordId: string;

	beforeEach(() => {
		cy.visit("/registros");
	});

	it("should display the registros page correctly", () => {
		cy.get("h1").should("contain", "Registros");
		cy.get('[data-testid="add-registro-button"]').should("be.visible");
		cy.get("table").should("be.visible");
	});

	it("should create a new record through the modal form", () => {
		cy.get('[data-testid="add-registro-button"]').should("be.visible").click();

		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog', {
			timeout: 10000,
		}).should("be.visible");
		cy.contains("Adicionar Novo Registro").should("be.visible");

		cy.get("#employee").should("be.visible").clear().type(testEmployee);
		cy.get("#salary").should("be.visible").clear().type(testSalary.toString());
		cy.get("#admissionDate").should("be.visible").type(testDate);

		cy.get('button[type="submit"]').should("be.visible").click();

		cy.contains("Registro cadastrado com sucesso", { timeout: 10000 }).should(
			"be.visible"
		);

		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"not.exist"
		);
	});

	it("should display the new record in the table", () => {
		cy.get("table").should("be.visible");

		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);

		cy.wait(1500);

		cy.get("table tbody tr").should("exist");
		cy.get("table tbody").should("contain", testEmployee);
	});

	it("should test table filters and debounce functionality", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);
		cy.wait(1500);
		cy.get("table tbody tr").should("have.length.at.least", 1);
		cy.get("table tbody").should("contain", testEmployee);

		cy.get('input[placeholder="Nome do funcionário"]').clear();
		cy.wait(1500);

		cy.get('input[placeholder="R$ 0,00"]').first().type("4000");
		cy.get('input[placeholder="R$ 0,00"]').eq(1).type("6000");
		cy.wait(1500);

		cy.get("table tbody tr").should("exist");

		cy.get("button").contains("Limpar Filtros").click();
		cy.get('input[placeholder="Nome do funcionário"]').should("have.value", "");
		cy.get('input[placeholder="R$ 0,00"]').first().should("have.value", "");
		cy.get('input[placeholder="R$ 0,00"]').eq(1).should("have.value", "");
	});

	it("should navigate to record details and display correct information", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);

		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.url().should("include", "/registros/");
		cy.get("h1").should("contain", "Detalhes do Registro");

		cy.get("#employee").should("have.value", testEmployee);
		cy.get("#salary").should("have.value", testSalary.toString());
		cy.get("#admissionDate").should("have.value", testDate);

		cy.contains("ID").parent().should("contain.text", "ID");
		cy.contains("Data de Criação").parent().should("be.visible");
		cy.contains("Salário Calculado").parent().should("be.visible");
		cy.contains("Data de Admissão Calculada").parent().should("be.visible");

		cy.contains("ID")
			.parent()
			.find("div")
			.last()
			.invoke("text")
			.then((id) => {
				recordId = id.trim();
			});
	});

	it("should update a record and reflect changes", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);
		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.get("h1").should("contain", "Detalhes do Registro");

		const updatedEmployee = `${testEmployee} Updated`;
		cy.get("#employee").should("not.be.disabled").clear().type(updatedEmployee);

		const updatedSalary = 7500;
		cy.get("#salary")
			.should("not.be.disabled")
			.clear()
			.type(updatedSalary.toString());

		cy.get("button").contains("Atualizar").click();

		cy.contains("Registro atualizado com sucesso", { timeout: 10000 }).should(
			"be.visible"
		);

		cy.get("a").contains("Voltar").click();

		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(updatedEmployee);
		cy.wait(1500);

		cy.get("table tbody").should("contain", updatedEmployee);
	});

	it("should delete a record with confirmation dialog", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);
		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.get("h1").should("contain", "Detalhes do Registro");

		cy.get("button").contains("Excluir").should("be.visible").click();

		cy.get('[data-slot="dialog-content"], [role="dialog"]', { timeout: 10000 })
			.should("be.visible")
			.within(() => {
				cy.contains("Tem certeza que deseja excluir esse registro?").should(
					"be.visible"
				);
				cy.contains("Essa ação é irreversível.").should("be.visible");
				cy.get("button").contains("Cancelar").should("be.visible");
				cy.get("button").contains("Excluir").should("be.visible");
			});

		cy.get("button").contains("Cancelar").click();
		cy.get('[data-slot="dialog-content"], [role="dialog"]').should("not.exist");

		cy.get("button").contains("Excluir").click();
		cy.get('[data-slot="dialog-content"], [role="dialog"]')
			.should("be.visible")
			.within(() => {
				cy.get("button").contains("Excluir").click();
			});

		cy.contains("Registro excluído com sucesso!", { timeout: 10000 }).should(
			"be.visible"
		);
		cy.url().should("include", "/registros");
		cy.url().should("not.include", "/registros/");
	});

	it("should verify delete API call with correct endpoint", () => {
		cy.intercept("DELETE", "**/registros/*").as("deleteRegistro");

		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);
		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.url().then((url) => {
			const recordId = url.split("/").pop();

			cy.get("button").contains("Excluir").click();
			cy.get('[data-slot="dialog-content"], [role="dialog"]')
				.should("be.visible")
				.within(() => {
					cy.get("button").contains("Excluir").click();
				});

			cy.wait("@deleteRegistro").then((interception) => {
				expect(interception.request.method).to.equal("DELETE");
				expect(interception.request.url).to.include(`/registros/${recordId}`);
			});
		});
	});

	it("should verify debounce functionality prevents excessive API calls", () => {
		let apiCallCount = 0;

		cy.intercept("GET", "**/registros*", (req) => {
			apiCallCount++;
			req.reply({ fixture: "registros.json" });
		}).as("getRegistrosDebounce");

		cy.get("button").contains("Limpar Filtros").click();
		cy.wait(1500);

		apiCallCount = 0;

		const searchTerm = "TestEmployee";
		cy.get('input[placeholder="Nome do funcionário"]').clear();

		for (let i = 0; i < searchTerm.length; i++) {
			cy.get('input[placeholder="Nome do funcionário"]').type(searchTerm[i]);
			cy.wait(50);
		}

		cy.wait(1500);

		cy.then(() => {
			expect(apiCallCount).to.be.lessThan(searchTerm.length);
			expect(apiCallCount).to.equal(1);
		});
	});

	it("should test comprehensive filter clearing functionality", () => {
		cy.get('input[placeholder="Nome do funcionário"]').type("Test Employee");
		cy.get('input[placeholder="R$ 0,00"]').first().type("2000");
		cy.get('input[placeholder="R$ 0,00"]').eq(1).type("5000");
		cy.get('input[placeholder="R$ 0,00"]').eq(2).type("3000");
		cy.get('input[placeholder="R$ 0,00"]').eq(3).type("7000");

		const today = new Date().toISOString().split("T")[0];
		cy.get('input[type="date"]').first().type(today);
		cy.get('input[type="date"]').last().type(today);

		cy.get('input[placeholder="Nome do funcionário"]').should(
			"not.have.value",
			""
		);
		cy.get('input[placeholder="R$ 0,00"]').first().should("not.have.value", "");

		cy.get("button").contains("Limpar Filtros").click();

		cy.get('input[placeholder="Nome do funcionário"]').should("have.value", "");
		cy.get('input[placeholder="R$ 0,00"]').first().should("have.value", "");
		cy.get('input[placeholder="R$ 0,00"]').eq(1).should("have.value", "");
		cy.get('input[placeholder="R$ 0,00"]').eq(2).should("have.value", "");
		cy.get('input[placeholder="R$ 0,00"]').eq(3).should("have.value", "");
		cy.get('input[type="date"]').first().should("have.value", "");
		cy.get('input[type="date"]').last().should("have.value", "");
	});

	it("should test form validation", () => {
		cy.get('[data-testid="add-registro-button"]').click();

		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"be.visible"
		);

		cy.get('button[type="submit"]').click();

		cy.contains("O nome do funcionário é obrigatório").should("be.visible");

		cy.get("#employee").type("Test Employee");
		cy.get('button[type="submit"]').click();

		cy.contains("O salário deve ser um valor positivo").should("be.visible");

		cy.get("#salary").type("1000");
		cy.get('button[type="submit"]').click();
		cy.contains("O salário mínimo é R$ 1.300,00").should("be.visible");

		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 1);
		const futureDateString = futureDate.toISOString().split("T")[0];

		cy.get("#admissionDate").type(futureDateString);
		cy.get("#salary").clear().type("2000");
		cy.get('button[type="submit"]').click();
		cy.contains("A data de admissão não pode estar no futuro").should(
			"be.visible"
		);

		cy.get("button").contains("Cancelar").click();
	});

	it("should test sorting functionality for all columns", () => {
		cy.get("button").contains("Limpar Filtros").click();
		cy.wait(1500);

		cy.get("table thead").contains("Funcionário").click();
		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Salário").click();
		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Salário Calculado").click();
		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Data de Admissão").click();
		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Data de Criação").click();
		cy.get("table tbody tr").should("exist");
	});

	it("should verify sorting API calls with correct parameters", () => {
		cy.intercept("GET", "**/registros*").as("getRegistros");

		cy.get("button").contains("Limpar Filtros").click();
		cy.wait(1500);

		cy.get("table thead").contains("Funcionário").click();
		cy.wait("@getRegistros").then((interception) => {
			expect(interception.request.url).to.include("orderBy=employee");
			expect(interception.request.url).to.include("order=asc");
		});

		cy.get("table thead").contains("Funcionário").click();
		cy.wait("@getRegistros").then((interception) => {
			expect(interception.request.url).to.include("orderBy=employee");
			expect(interception.request.url).to.include("order=desc");
		});

		cy.get("table thead").contains("Salário").click();
		cy.wait("@getRegistros").then((interception) => {
			expect(interception.request.url).to.include("orderBy=salary");
			expect(interception.request.url).to.include("order=asc");
		});

		cy.get("table thead").contains("Salário Calculado").click();
		cy.wait("@getRegistros").then((interception) => {
			expect(interception.request.url).to.include("orderBy=calculatedSalary");
			expect(interception.request.url).to.include("order=asc");
		});

		cy.get("table thead").contains("Data de Admissão").click();
		cy.wait("@getRegistros").then((interception) => {
			expect(interception.request.url).to.include("orderBy=admissionDate");
			expect(interception.request.url).to.include("order=asc");
		});

		cy.get("table thead").contains("Data de Criação").click();
		cy.wait("@getRegistros").then((interception) => {
			expect(interception.request.url).to.include("orderBy=createdAt");
			expect(interception.request.url).to.include("order=asc");
		});
	});

	it("should test pagination functionality", () => {
		cy.get("button").contains("Limpar Filtros").click();
		cy.wait(1500);

		cy.get("body").then(($body) => {
			if ($body.find('button:contains("Próximo")').length > 0) {
				cy.get('button:contains("Próximo")').then(($nextBtn) => {
					if (!$nextBtn.is(":disabled")) {
						cy.wrap($nextBtn).click();
						cy.get("table tbody tr").should("exist");

						cy.get('button:contains("Anterior")')
							.should("not.be.disabled")
							.click();
						cy.get("table tbody tr").should("exist");
					}
				});
			}
		});
	});

	it("should handle API errors gracefully", () => {
		cy.intercept("POST", "**/registros", {
			statusCode: 500,
			body: { message: "Server Error" },
		}).as("createError");

		cy.get('[data-testid="add-registro-button"]').click();
		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"be.visible"
		);

		cy.get("#employee").type("Test Employee Error");
		cy.get("#salary").type("2000");
		cy.get("#admissionDate").type(testDate);
		cy.get('button[type="submit"]').click();

		cy.contains("Server Error", { timeout: 10000 }).should("be.visible");
	});
});
