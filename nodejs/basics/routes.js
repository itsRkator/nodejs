const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write(`
                <!Doctype html>
                <html>
                    <head><title>Enter Message</title></head>
                    <body>
                        <form action='/message' method='POST'>
                            <input type='text' name='message' />
                            <button type='submit'>Submit</button>
                        </form>
                    </body>
                </html>
            `);
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message_container.txt", message, (err) => {
        if (err) {
          res.setHeader("Content-Type", "text/html");
          res.write(`
                    <!Doctype html>
                    <html>
                        <head><title>Error page</title></head>
                        <body><h1>${err.message}</h1></body>
                    </html>
                `);
          return res.end();
        }
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
};

module.exports = { requestHandler };
// module.exports = requestHandler;

// module.exports.requestHandler = requestHandler;
// module.exports.someText = "Hello from some texts";

// exports.requestHandler = requestHandler;
// exports.someText = "Hello from some texts";
