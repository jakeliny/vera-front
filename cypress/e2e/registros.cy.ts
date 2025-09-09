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

		cy.wait(1000);

		cy.get("table tbody tr").should("exist");
		cy.get("table tbody").should("contain", testEmployee);
	});

	it("should test table filters", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);
		cy.get("table tbody tr").should("have.length.at.least", 1);
		cy.get("table tbody").should("contain", testEmployee);

		cy.get('input[placeholder="Nome do funcionário"]').clear();

		cy.get('input[placeholder="R$ 0,00"]').first().type("4000");
		cy.get('input[placeholder="R$ 0,00"]').eq(1).type("6000");

		cy.get("table tbody tr").should("exist");

		cy.get("button").contains("Limpar Filtros").click();
		cy.get('input[placeholder="Nome do funcionário"]').should("have.value", "");
	});

	it("should navigate to record details and display correct information", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);

		cy.wait(1000);

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

		cy.get("#id").should("be.disabled");
		cy.get("#calculatedSalary").should("be.disabled");
		cy.get("#createdAt").should("be.disabled");
		cy.get("#calculatedAdmissionDate").should("be.disabled");

		cy.get("#id")
			.invoke("val")
			.then((id) => {
				recordId = id as string;
			});
	});

	it("should update a record and reflect changes", () => {
		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(testEmployee);
		cy.wait(1000);

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

		cy.get('button[type="submit"]').click();

		cy.contains("Registro atualizado com sucesso", { timeout: 10000 }).should(
			"be.visible"
		);

		cy.get("a").contains("Voltar").click();

		cy.get('input[placeholder="Nome do funcionário"]')
			.clear()
			.type(updatedEmployee);
		cy.wait(1000);

		cy.get("table tbody").should("contain", updatedEmployee);
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

	it("should test pagination and sorting functionality", () => {
		cy.get("button").contains("Limpar Filtros").click();

		cy.get("table thead").contains("Funcionário").click();

		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Salário").click();
		cy.get("table tbody tr").should("exist");

		cy.get("body").then(($body) => {
			if ($body.find('[data-testid="pagination"]').length > 0) {
				cy.get('[data-testid="pagination"]').should("be.visible");

				cy.get('[data-testid="next-page"]').then(($nextBtn) => {
					if (!$nextBtn.is(":disabled")) {
						cy.wrap($nextBtn).click();
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
