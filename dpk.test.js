const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Process partitionKey as string less than max length", () => {
    const key = deterministicPartitionKey({ partitionKey: "1" });
    expect(key).toBe("1");
  });

  it("Process partitionKey as string less greater than max length", () => {
    const partitionKey =
      "duppwycavviykkxbtnagpnmpzfahiaznjtecnybesukhhqkjmewqmyqlpnnisoxlcozqzyhgzurerxfqzuditcsesmptkhuvemtiqajjadhcduusclkzfnkoahnmcaagrcvwzbyqxnjnfkuzsxwproqzoffcidwewsrppyemsmdxtnxfcnivcwsulmymstmuvqdbfhxmdnfptkkozlrudqcndecytsvkhpmhqqkkydpomuxrpwirrqvblvpxqrjfucyyemjgjrvkwajjbrpfbuismyrgrbwzdnjddwwhfjvp";
    const expectedResult =
      "322462cfd13edc242c6b991ff59e9ce625581e21bc646be893c5651bcda86225fdea66805b5f19571a3145f191b05bdc8287ac9233a13f3afacf8dc7bd176887";
    const key = deterministicPartitionKey({ partitionKey });
    expect(key.length).toEqual(128);
    expect(key).toBe(expectedResult);
  });

  describe("Returns string value for various event types", () => {
    it("number", () => {
      const partitionKey = 100;
      const actualResult = deterministicPartitionKey({ partitionKey });
      expect(actualResult).toBe(JSON.stringify(partitionKey));
    });

    it("object", () => {
      const partitionKey = { variousKey: { testAttr: 1 } };
      const actualResult = deterministicPartitionKey({
        partitionKey,
      });
      expect(actualResult).toEqual(JSON.stringify(partitionKey));
    });
  });
});
