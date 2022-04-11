export default {
  smoothMatrixChange(Matrix_1, Matrix_2) {
    return Matrix_2.map((i, k) => {
      return Matrix_1[k] + (i - Matrix_1[k]) / 5;
    });
  },
};
