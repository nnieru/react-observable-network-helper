<h1>React Observable Network Helper</h1>

**Problem:** In React applications, managing state for each network request can become repetitive and inefficient. For every single network request, the developer must create a new state to track loading, success, or failure, leading to redundant code. This repetitive process complicates the application as the number of requests grows, making it harder to maintain and scale.

**Challange:** Find efficient way to manage state for a network requests without have a redundant code to manage the state.

**Proposed Solution**: Introducing a React Observable Network Helper – a simple approach to manage network requests in React. This helper listens and emits state changes (loading, success, failure) for each network request, eliminating the need to create redundant states every time. By centralizing state management for network requests, this solution simplifies the network request code and reduces repetition.

**Overview:**

![overview](./documentation/overview.png)

**Flow:**

![flow](./documentation/flow.png)

I'm very happy to hear your feedback!
