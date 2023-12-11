import fs from "fs";
import readline from "readline";

// Путь к исходному текстовому документу
const inputFilePath = "filter.txt";

// Путь к новому js файлу
const outputFilePath = "output.js";

// Функция для чтения данных из текстового файла построчно
const readData = async () => {
  const readStream = fs.createReadStream(inputFilePath, "utf-8");
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  const dataArray = [];

  for await (const line of rl) {
    const numbers = line.split(" ").map(Number);
    dataArray.push(numbers);
  }

  // Записываем результат в новый js файл
  writeToFile(dataArray);
};

// Функция для записи данных в новый js файл
const writeToFile = async (data) => {
  const jsCode = `const dataArray = ${JSON.stringify(
    data,
    null,
    2
  )};\n\nconsole.log(dataArray);`;

  try {
    await fs.promises.writeFile(outputFilePath, jsCode);
    console.log(`Data has been successfully written to ${outputFilePath}`);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
};

// Запускаем чтение данных из файла
readData();
