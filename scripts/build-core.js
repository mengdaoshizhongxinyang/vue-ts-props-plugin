const { exec } = require('child_process');
exec('cd ./packages/core && pnpm run build', (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
})