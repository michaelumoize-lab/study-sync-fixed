const { ESLint } = require("eslint");

(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["app/**/*.ts", "app/**/*.tsx", "components/**/*.ts", "components/**/*.tsx"]);
  
  let hasErrors = false;
  results.forEach(result => {
    const errors = result.messages.filter(m => m.severity === 2);
    if (errors.length > 0) {
      hasErrors = true;
      console.log(`\nFILE: ${result.filePath}`);
      errors.forEach(e => {
        console.log(`  Line ${e.line}:${e.column} - ${e.message} (${e.ruleId})`);
      });
    }
  });
  
  if (hasErrors) {
    process.exit(1);
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
