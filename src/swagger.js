const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Smart Home Management System API",
			version: "1.0.0",
			description: "API documentation for the Smart Home Management System",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
	},
	apis: ["./routes/*.js"], // Path to the API routes
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
