// Test server ko alag port (3100) par start karta hai, tests chalata hai, phir server band karta hai
// Isse tumhara chalu server (port 3000) touch nahi hota, aur hamesha fresh code test hota hai
const { spawn } = require("child_process");

const PORT = 3100;

const server = spawn(process.execPath, ["server.js"], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ["ignore", "pipe", "inherit"],
});
server.stdout.on("data", (d) => process.stdout.write(d));

setTimeout(() => {
  const runner = spawn(process.execPath, ["--test", "test.js"], {
    env: { ...process.env, TEST_PORT: String(PORT) },
    stdio: "inherit",
  });
  runner.on("exit", (code) => {
    server.kill();
    process.exit(code ?? 1);
  });
}, 1500);
