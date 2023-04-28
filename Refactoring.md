# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

1. First of all, I've created several test cases to check input formats: as string, as huge string to validate digest/crypto fn, and several types for partitionKey
2. After that dpk.js was refactored: 
- I've decided to split one function to 3 functions
- `digest` - obviously it should be encapsulated to separate block to be more unopinionated about implementation (for example, with `crypto` package or not).
- `resolveCandidate` - this resolver must know how to work with `event` of various forms, and could be separated easily
- `deterministicPartitionKey` - it is still a factory method, but after this refactoring it's know less about implementation of event and event structure. `MAX_PARTITION_KEY_LENGTH` still inside it (not inside `resolveCandidate`) because maxLength is attribute of partition key and have to be inside this function.

I thought about moving `TRIVIAL_PARTITION_KEY` to `deterministicPartitionKey` but it's actually depends on other functionality that could use `resolveCandidate` & `deterministicPartitionKey`. Will there be any other `resolveCandidate` strategies for other event types(?), for example.  
By the way, I didn't change digest algorithm because some part of the system could be coupled to some expected output of this crypto algorithm so crypto usage stays the same.