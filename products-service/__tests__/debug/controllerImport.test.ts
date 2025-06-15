describe("Controller Import Debug", () => {
  it("should import controller functions", () => {
    const {
      getProducts,
      getProductById,
    } = require("../../controllers/productController");

    expect(getProducts).toBeDefined();
    expect(typeof getProducts).toBe("function");
    expect(getProductById).toBeDefined();
    expect(typeof getProductById).toBe("function");
  });
});
