// Написать рекурсивную функцию вычисления чисел Фибоначчи.
// На вход функции подавать длину конечного массива чисел.
function fibonacci(len) {
  let res = [];
  for (let i = len - 1; i >= 0; i--) {
    res.push(f(i));
  }

  function f(n) {
    if (n === 0) {
      return 0;
    } else if (n === 1) {
      return 1;
    } else {
      return f(n - 1) + f(n - 2);
    }
  }

  return res.reverse();
}

console.log(fibonacci(8));
