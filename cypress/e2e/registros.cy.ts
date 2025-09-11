describe("Registros Management", () => {
	const testEmployee = `Test Employee ${Date.now()}`;
	const testSalary = 5000;
	const testDate = new Date().toISOString().split("T")[0];

	beforeEach(() => {
		cy.visit("/registros");
	});

	it("should display the registros page correctly", () => {
		cy.get("h1").should("contain", "Records");
		cy.get('[data-testid="add-registro-button"]').should("be.visible");
		cy.get("table").should("be.visible");
	});

	it("should create a new record through the modal form", () => {
		cy.get('[data-testid="add-registro-button"]').should("be.visible").click();

		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog', {
			timeout: 10000,
		}).should("be.visible");
		cy.contains("Add New Record").should("be.visible");

		cy.get("#employee").should("be.visible").clear().type(testEmployee);
		cy.get("#salary").should("be.visible").clear().type(testSalary.toString());
		cy.get("#admissionDate").should("be.visible").type(testDate);

		cy.get('button[type="submit"]').should("be.visible").click();

		cy.contains("Record created successfully", { timeout: 10000 }).should(
			"be.visible"
		);

		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"not.exist"
		);
	});

	it("should display the new record in the table", () => {
		cy.get("table").should("be.visible");

		cy.get('input[placeholder="Employee name"]').clear().type(testEmployee);

		cy.wait(1500);

		cy.get("table tbody tr").should("exist");
		cy.get("table tbody").should("contain", testEmployee);
	});

	it("should test table filters and debounce functionality", () => {
		cy.get('input[placeholder="Employee name"]').clear().type(testEmployee);
		cy.wait(1500);
		cy.get("table tbody tr").should("have.length.at.least", 1);
		cy.get("table tbody").should("contain", testEmployee);

		cy.get('input[placeholder="Employee name"]').clear();
		cy.wait(1500);

		cy.get('input[placeholder="$ 0.00"]').first().type("4000");
		cy.get('input[placeholder="$ 0.00"]').eq(1).type("6000");
		cy.wait(1500);

		cy.get("table tbody tr").should("exist");

		cy.get("button").contains("Clear Filters").click();
		cy.get('input[placeholder="Employee name"]').should("have.value", "");
		cy.get('input[placeholder="$ 0.00"]').first().should("have.value", "");
		cy.get('input[placeholder="$ 0.00"]').eq(1).should("have.value", "");
	});

	it("should navigate to record details and display correct information", () => {
		cy.get('input[placeholder="Employee name"]').clear().type(testEmployee);

		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.url().should("include", "/registros/");
		cy.get("h1").should("contain", "Record Details");

		cy.get("#employee").should("have.value", testEmployee);
		cy.get("#salary").should("have.value", testSalary.toString());
		cy.get("#admissionDate").should("have.value", testDate);

		cy.contains("ID").parent().should("contain.text", "ID");
		cy.contains("Calculated Admission Date").parent().should("be.visible");
		cy.contains("Calculated Salary (35%)").parent().should("be.visible");
		cy.contains("Calculated Admission Date").parent().should("be.visible");

		cy.contains("ID").parent().find("div").last().should("exist");
	});

	it("should update a record and reflect changes", () => {
		const updateTestEmployee = `Update Test ${Date.now()}`;

		cy.get('[data-testid="add-registro-button"]').click();
		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"be.visible"
		);
		cy.get("#employee").type(updateTestEmployee);
		cy.get("#salary").type("4000");
		cy.get("#admissionDate").type(testDate);
		cy.get('button[type="submit"]').click();
		cy.contains("Record created successfully", { timeout: 10000 }).should(
			"be.visible"
		);
		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"not.exist"
		);

		cy.get('input[placeholder="Employee name"]')
			.clear()
			.type(updateTestEmployee);
		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.get("h1").should("contain", "Record Details");

		const updatedEmployee = `${updateTestEmployee.substring(0, 20)} Upd`;
		cy.get("#employee").should("not.be.disabled").clear().type(updatedEmployee);

		const updatedSalary = 7500;
		cy.get("#salary")
			.should("not.be.disabled")
			.clear()
			.type(updatedSalary.toString());

		cy.get("button").contains("Update").click();

		cy.wait(1000);
		cy.contains("Record updated successfully", { timeout: 15000 }).should(
			"be.visible"
		);

		cy.get("a").contains("Back").click({ force: true });

		cy.get('input[placeholder="Employee name"]').clear().type(updatedEmployee);
		cy.wait(1500);

		cy.get("table tbody").should("contain", updatedEmployee);
	});

	it("should delete a record with confirmation dialog", () => {
		cy.get('input[placeholder="Employee name"]').clear().type(testEmployee);
		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.get("h1").should("contain", "Record Details");

		cy.get("button").contains("Delete").should("be.visible").click();

		cy.get('[data-slot="dialog-content"], [role="dialog"]', { timeout: 10000 })
			.should("be.visible")
			.within(() => {
				cy.contains("Are you sure you want to delete this record?").should(
					"be.visible"
				);
				cy.contains("This action is irreversible.").should("be.visible");
				cy.get("button").contains("Cancel").should("be.visible");
				cy.get("button").contains("Delete").should("be.visible");
			});

		cy.get("button").contains("Cancel").click();
		cy.get('[data-slot="dialog-content"], [role="dialog"]').should("not.exist");

		cy.get("button").contains("Delete").click();
		cy.get('[data-slot="dialog-content"], [role="dialog"]')
			.should("be.visible")
			.within(() => {
				cy.get("button").contains("Delete").click();
			});

		cy.contains("Record deleted successfully!", { timeout: 10000 }).should(
			"be.visible"
		);
		cy.url().should("include", "/registros");
		cy.url().should("not.include", "/registros/");
	});

	it("should verify delete API call with correct endpoint", () => {
		cy.intercept("DELETE", "**/registros/*").as("deleteRegistro");

		const deleteTestEmployee = `Delete Test ${Date.now()}`;

		cy.get('[data-testid="add-registro-button"]').click();
		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"be.visible"
		);
		cy.get("#employee").type(deleteTestEmployee);
		cy.get("#salary").type("3000");
		cy.get("#admissionDate").type(testDate);
		cy.get('button[type="submit"]').click();
		cy.contains("Record created successfully", { timeout: 10000 }).should(
			"be.visible"
		);
		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"not.exist"
		);

		cy.get('input[placeholder="Employee name"]')
			.clear()
			.type(deleteTestEmployee);
		cy.wait(1500);

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("a").first().click();
			});

		cy.url().then((url) => {
			const recordId = url.split("/").pop();

			cy.get("button").contains("Delete").click();
			cy.get('[data-slot="dialog-content"], [role="dialog"]')
				.should("be.visible")
				.within(() => {
					cy.get("button").contains("Delete").click();
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

		cy.get("button").contains("Clear Filters").click();
		cy.wait(1500);

		apiCallCount = 0;

		const searchTerm = "TestEmployee";
		cy.get('input[placeholder="Employee name"]').clear();

		for (let i = 0; i < searchTerm.length; i++) {
			cy.get('input[placeholder="Employee name"]').type(searchTerm[i]);
			cy.wait(50);
		}

		cy.wait(1500);

		cy.then(() => {
			expect(apiCallCount).to.be.lessThan(searchTerm.length);
			expect(apiCallCount).to.be.at.most(3);
		});
	});

	it("should test comprehensive filter clearing functionality", () => {
		cy.get('input[placeholder="Employee name"]').type("Test Employee");
		cy.get('input[placeholder="$ 0.00"]').first().type("2000");
		cy.get('input[placeholder="$ 0.00"]').eq(1).type("5000");
		cy.get('input[placeholder="$ 0.00"]').eq(2).type("3000");
		cy.get('input[placeholder="$ 0.00"]').eq(3).type("7000");

		const today = new Date().toISOString().split("T")[0];
		cy.get('input[type="date"]').first().type(today);
		cy.get('input[type="date"]').last().type(today);

		cy.get('input[placeholder="Employee name"]').should("not.have.value", "");
		cy.get('input[placeholder="$ 0.00"]').first().should("not.have.value", "");

		cy.get("button").contains("Clear Filters").click();

		cy.get('input[placeholder="Employee name"]').should("have.value", "");
		cy.get('input[placeholder="$ 0.00"]').first().should("have.value", "");
		cy.get('input[placeholder="$ 0.00"]').eq(1).should("have.value", "");
		cy.get('input[placeholder="$ 0.00"]').eq(2).should("have.value", "");
		cy.get('input[placeholder="$ 0.00"]').eq(3).should("have.value", "");
		cy.get('input[type="date"]').first().should("have.value", "");
		cy.get('input[type="date"]').last().should("have.value", "");
	});

	it("should test form validation", () => {
		cy.get('[data-testid="add-registro-button"]').click();

		cy.get('[data-slot="dialog-content"], [role="dialog"], .dialog').should(
			"be.visible"
		);

		cy.get('button[type="submit"]').click();

		cy.contains("Employee name is required", {
			timeout: 5000,
		}).should("be.visible");

		cy.get("#employee").type("Test Employee");
		cy.get('button[type="submit"]').click();

		cy.wait(500);
		cy.contains("Minimum salary is $1.00.", {
			timeout: 5000,
		}).should("be.visible");

		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 1);
		const futureDateString = futureDate.toISOString().split("T")[0];

		cy.get("#admissionDate").type(futureDateString);
		cy.get("#salary").clear().type("2000");
		cy.get('button[type="submit"]').click();
		cy.contains("Admission date cannot be in the future").should("be.visible");

		cy.get("button").contains("Cancel").click();
	});

	it("should test sorting functionality for all columns", () => {
		cy.get("button").contains("Clear Filters").click();
		cy.wait(1500);

		cy.get("table thead").contains("Employee").click();
		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Salary").click();
		cy.get("table tbody tr").should("exist");

		cy.get("table thead").contains("Admission Date").click();
		cy.get("table tbody tr").should("exist");
	});

	it("should verify sorting API calls with correct parameters", () => {
		cy.intercept("GET", "**/registros?*orderBy=employee&order=asc*").as(
			"getRegistrosWithOrderByEmployeeAsc"
		);

		cy.get("button").contains("Clear Filters").click();
		cy.wait(1500);

		cy.get("table thead").within(() => {
			cy.contains("Employee").parent().find("button").click();
		});
		cy.wait(1000);
		cy.wait("@getRegistrosWithOrderByEmployeeAsc").then((interception) => {
			expect(interception.request.url).to.include("orderBy=employee");
			expect(interception.request.url).to.include("order=asc");
		});
		cy.intercept("GET", "**/registros?*orderBy=employee&order=desc*").as(
			"getRegistrosWithOrderByEmployeeDesc"
		);

		cy.get("table thead").within(() => {
			cy.contains("Employee").parent().find("button").click();
		});
		cy.wait(1000);
		cy.wait("@getRegistrosWithOrderByEmployeeDesc").then((interception) => {
			expect(interception.request.url).to.include("orderBy=employee");
			expect(interception.request.url).to.include("order=desc");
		});

		cy.intercept("GET", "**/registros?*orderBy=salary*").as(
			"getRegistrosWithOrderBySalaryAsc"
		);

		cy.get("table thead").within(() => {
			cy.contains("Salary").parent().find("button").click();
		});
		cy.wait(1000);
		cy.wait("@getRegistrosWithOrderBySalaryAsc").then((interception) => {
			expect(interception.request.url).to.include("orderBy=salary");
			expect(interception.request.url).to.include("order=asc");
		});

		cy.intercept("GET", "**/registros?*orderBy=admissionDate*").as(
			"getRegistrosWithOrderByAdmissionDateAsc"
		);

		cy.get("table thead").within(() => {
			cy.contains("Admission Date").parent().find("button").click();
		});
		cy.wait(1000);
		cy.wait("@getRegistrosWithOrderByAdmissionDateAsc").then((interception) => {
			expect(interception.request.url).to.include("orderBy=admissionDate");
			expect(interception.request.url).to.include("order=asc");
		});
	});

	it("should test pagination functionality", () => {
		cy.get("button").contains("Clear Filters").click();
		cy.wait(1500);

		cy.get("body").then(($body) => {
			if ($body.find('button:contains("Próximo")').length > 0) {
				cy.get('button:contains("Next")').then(($nextBtn) => {
					if (!$nextBtn.is(":disabled")) {
						cy.wrap($nextBtn).click();
						cy.get("table tbody tr").should("exist");

						cy.get('button:contains("Previous")')
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

		cy.get("body").should("satisfy", (body) => {
			const text = body.text();
			return (
				text.includes("Server Error") || text.includes("Erro ao criar registro")
			);
		});
	});
});
