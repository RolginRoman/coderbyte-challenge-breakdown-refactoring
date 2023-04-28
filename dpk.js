const crypto = require("crypto");

function digest(input) {
  return crypto.createHash("sha3-512").update(input).digest("hex");
}

function resolveCandidate(event) {
  const TRIVIAL_PARTITION_KEY = "0";
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }
  const key = event.partitionKey ? event.partitionKey : event;
  return typeof key === "string" ? key : JSON.stringify(key);
}

exports.deterministicPartitionKey = (event) => {
  const MAX_PARTITION_KEY_LENGTH = 256;
  const candidate = resolveCandidate(event);
  return candidate.length > MAX_PARTITION_KEY_LENGTH
    ? digest(candidate)
    : candidate;
};
