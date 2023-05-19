const { exec } = require('child_process');
exec('cd ./packages/vite && pnpm run serve', (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})