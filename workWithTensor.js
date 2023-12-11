import dataArray from './prepareTensor/output.js'

//Находим элементы
const image = window.document.querySelector("img");
const canvas = window.document.querySelector("canvas");

tf.setBackend('cpu');

// Создание тензора изображения
const tensor1 = tf.browser.fromPixels(image);

// Нормализация значений в диапазон [0, 1]
const normalizedTensor = tensor1.div(tf.scalar(255));

const [height, width, channels] = normalizedTensor.shape;

// Создание функции linspace аналогичной NumPy в JavaScript
function linspace(start, end, numPoints) {
    const step = (end - start) / (numPoints - 1);
    return Array.from({ length: numPoints }, (_, index) => start + step * index);
}

// Задание параметров
const startValue = 0;
const endValue = 1;
const numberOfPoints = 60;

// Создание массива из 60 значений, равномерно распределенных между 0 и 1
const array = linspace(startValue, endValue, numberOfPoints);

const tensorArray = normalizedTensor.arraySync();  // Получаем тензор как массив

// Проходим по высоте
for (let i = 0; i < 150; i++) {
    const resultArrray = []
    // Проходим по ширине
    for (let j = 0; j < 150; j++) {
        // Проходим по каналам
        for (let k = 0; k < channels; k++) {
            const pixelValue = normalizedTensor.arraySync()[i][j][k];
            //функция для нахождения ближайшего числа в масиве
            function findClosestNumberIndex(targetNumber, numberArray) {
                let closestIndex = 0;
                let closestDifference = Math.abs(targetNumber - numberArray[0]);
            
                for (let i = 1; i < numberArray.length; i++) {
                    const difference = Math.abs(targetNumber - numberArray[i]);
            
                    if (difference < closestDifference) {
                        closestIndex = i;
                        closestDifference = difference;
                    }
                }
            
                return closestIndex;
            }
            const closestIndex = findClosestNumberIndex(pixelValue, array);

            // Получаем значение элемента тензора
            console.log(`${pixelValue} ближайший к ${array[closestIndex]}`)
            resultArrray.push(closestIndex)
        }
        //получение индекса в лут
        const bigIndex = resultArrray[0]*60**2 + resultArrray[1]*60 + resultArrray[2]
        console.log(`индекс в лут ${bigIndex}`)
        console.log(normalizedTensor.arraySync()[i][j])
        tensorArray[i][j] = dataArray[bigIndex];  // Заменяем значение в массиве
        console.log(tensorArray[i][j])
    }
}
console.log(tensorArray)
const updatedTensor = tf.tensor(tensorArray);  // Создаем новый тензор с обновленными значениями
updatedTensor.print()
// Преобразование тензора в пиксельные значения
const pixels = updatedTensor.mul(255).clipByValue(0, 255).cast("int32");

// Отображение на холсте
tf.browser.toPixels(pixels, canvas).then(() => {
  console.log("Image created from divided tensor");
});
