describe("Mock Debug Test", () => {
  it("should verify jest mocking works", () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue("test");

    const result = mockFn();

    expect(result).toBe("test");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
