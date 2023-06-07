# **File Generator by ALWATROOS**

## **1. What is it for?**

This CLI is created for generating files using [`EJS`](https://www.npmjs.com/package/ejs) template engine.<br>
You can define your own templates in `templates` directory.<br>
Each subdirectory in `templates` directory is treated as component template and you can list such components using `fgen -ls` or `fgen --list` commands.<br>

## **2. How it works?**

You define templates in `templates` directory using [`EJS`](https://www.npmjs.com/package/ejs) markup language and `FGEN` do the rest for you!<br>
You can also avoid using default configs and you can create `fgen.config.json` file with your own custom config.<br>

```json
{
  "workDir": "[Optional][String] Path to work directory -> default to directory where fgen is used",
  "srcDir": "[Optional][String] Path to source directory -> default to 'src'",
  "templateSrc": "[Optional][String] Path to template directory -> default to 'templates'",
  "configPath": "[Optional][String] Path to configuration file -> default to '$WORK_DIR/fgen.config.json'",
  "debugMode": "[Optional][Boolean] Enables/Disables debug mode which writes some more data in console -> default to 'false'",
  "fileNamePattern": "[Optional][String] Naming convention for naming files with '_NAME_' variable (possible values -> 'kebab-case', 'camel-case', 'pascal-case') -> default to 'pascal-case'",
  "contentNamePattern": "[Optional][String] Naming convention for naming fields in files with 'name' variable (possible values -> 'kebab-case', 'camel-case', 'pascal-case') -> default to 'camel-case'"
}
```
<br>

## **3. Example usage**
`fgen -g store -v name=super -v someOtherVariable=someValue` <- this command would generate component from template `store` with passed variables `name` and `someOtherVariable`.<br>
`name` variable is used for naming things inside templates (for example files -> `_NAME_.ts` would generate `Super.ts`).<br><br>
If you want to see all possible commands provided by `fgen` cli then type command `fgen -h` or `fgen --help`.<br>
## **4. Credentials**
- [Author's website](https://karolploski.dev)<br>
- [Author's linkedin](https://pl.linkedin.com/in/karol-ploski-linkdin)
<br><br>

Libraries used:
- [EJS](https://www.npmjs.com/package/ejs)
- [COMMANDER](https://www.npmjs.com/package/commander)
- [FIGLET](https://www.npmjs.com/package/figlet)