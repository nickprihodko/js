// Написать функцию, получающую массив с вложенными массивами и возвращающую его “плоскую” версию.
// Встроенный метод массивов flat использовать нельзя

let start = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
let res = [];

function flat(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      flat(arr[i]);
    } else {
      res.push(arr[i]);
    }
  }
}

flat(start);

console.log(res);
