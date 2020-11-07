// Написать функцию, которая принимает целочисленный number и рисует спиральную матрицу NxN, где N - входной параметр

const matrix = (n) => {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push([]);
  }

  let startCol = 0;
  let endCol = n - 1;
  let startRow = 0;
  let endRow = n - 1;
  counter = 1;

  while (startCol <= endCol && startRow <= endRow) {
    // render first row
    for (let i = startCol; i <= endCol; i++) {
      results[startRow][i] = counter;
      counter++;
    }
    startRow++;

    // render right column
    for (let i = startRow; i <= endRow; i++) {
      results[i][endRow] = counter;
      counter++;
    }
    endCol--;

    // render bottom row
    for (let i = endCol; i >= startCol; i--) {
      results[endRow][i] = counter;
      counter++;
    }
    endRow--;

    // render left column
    for (let i = endRow; i >= startRow; i--) {
      results[i][startCol] = counter;
      counter++;
    }
    startCol++;
  }

  return results;
};

console.log(matrix(3));
