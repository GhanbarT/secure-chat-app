const app = require("./app");
const http = require("http");

(async () => {
	const port = process.env.PORT || 3000;
	const server = http.createServer(app);
	server.listen(port, () => {
		console.log(`server running on port ${port}`)
	})
})();
