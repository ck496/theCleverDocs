# React Hooks Guide

React Hooks are functions that let you use state and other React features in functional components.

## useState Hook

The `useState` hook lets you add state to functional components.

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## useEffect Hook

The `useEffect` hook lets you perform side effects in function components.

```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## Best Practices

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Use custom hooks** for reusable stateful logic
3. **Follow the rules of hooks** - Use the ESLint plugin to catch mistakes

## Conclusion

React Hooks provide a powerful way to use state and lifecycle features in functional components, making your code more readable and maintainable.