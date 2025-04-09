const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

(async function testCargoApp() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Abrir a página de login
    await driver.get("http://localhost:3001/login"); 

    // Esperar até que o campo de entrada de usuário esteja visível e interagível
    await driver.wait(until.elementLocated(By.id("user")), 10000);
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("user"))),
      10000
    );
    await driver.sleep(5000);
    

    // Inserir o nome de usuário
    await driver
      .findElement(By.id("user"))
      .sendKeys("mateusmartinscg@hotmail.com");

    // Esperar até que o campo de entrada de senha esteja visível e interagível
    await driver.wait(until.elementLocated(By.id("password")), 10000);
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("password"))),
      10000
    );

    // Inserir a senha e submeter o formulário
    await driver.findElement(By.id("password")).sendKeys("1234", Key.RETURN);

    await driver.sleep(5000);
    await driver.get("http://localhost:3001/cargo");

    await driver.sleep(5000);
    await driver.findElement(By.id("inclusaoCargo")).click();

    await driver.wait(until.elementLocated(By.css(".p-dialog")), 2000);
    

    // Encontrar o campo de entrada e digitar "Admin"
    await driver.findElement(By.id("cargo")).sendKeys("Cozinheiro");
    await driver.sleep(5000);
       // Fechar o diálogo 
       await driver
       .findElement(By.css(".p-dialog .p-dialog-header-close"))
       .click();

    // Encontrar e clicar no botão
    await driver.findElement(By.id("registrarCargo")).click();
    await driver.sleep(5000);



    // Esperar até que os resultados sejam exibidos 
    await driver.wait(until.elementLocated(By.css(".p-datatable")), 2000);

    // Capturar e imprimir os resultados 
    let rows = await driver.findElements(
      By.css(".p-datatable .p-datatable-tbody tr")
    );
    for (let row of rows) {
      console.log(await row.getText());
    }
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  } finally {
    // Fechar o navegador
    await driver.quit();
  }
})();
