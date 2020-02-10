# Recursion

## Base recursion

Recursion in computer science is a method of solving a problem where the solution depends on solutions to smaller instances of the same problem. Such problems can generally be solved by iteration, but this needs to identify and index the smaller instances at programming time.

```js
function recsum(x) {
    if (x === 1) {
        return x;
    } else {
        return x + recsum(x - 1);
    }
}
```
Call stack:
```bash
recsum(5)
5 + recsum(4)
5 + (4 + recsum(3))
5 + (4 + (3 + recsum(2)))
5 + (4 + (3 + (2 + recsum(1))))
5 + (4 + (3 + (2 + 1)))
15
```

[#recursion](./recursion.md) [#algorithms](./algorithms.md)

## Tail recursion

In computer science, a tail call is a subroutine call performed as the final action of a procedure. If a tail call might lead to the same subroutine being called again later in the call chain, the subroutine is said to be tail-recursive, which is a special case of recursion.

```js
function tailrecsum(x, running_total = 0) {
    if (x === 0) {
        return running_total;
    } else {
        return tailrecsum(x - 1, running_total + x);
    }
}
```
Call stack:
```bash
tailrecsum(5, 0)
tailrecsum(4, 5)
tailrecsum(3, 9)
tailrecsum(2, 12)
tailrecsum(1, 14)
tailrecsum(0, 15)
15
```

Tail calls can be implemented without adding a new stack frame to the call stack. Most of the frame of the current procedure is no longer needed, and can be replaced by the frame of the tail call, modified as appropriate (similar to overlay for processes, but for function calls). The program can then jump to the called subroutine. Producing such code instead of a standard call sequence is called tail call elimination or tail call optimization. Tail call elimination allows procedure calls in tail position to be implemented as efficiently as goto statements

[#recursion](./recursion.md) [#algorithms](./algorithms.md)

## Media stored in file system

There is ability to write media files in 2 styles: inline and reference.

%

Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser.

**Inline-style**

With title: ![alt text](../samples/resources/nodejs.png "Node.js logo")

Without title: ![alt text](../samples/resources/nodejs.png)

**Reference-style**

With title: ![alt text][node.js]

Without title: ![alt text][node.js no title]

[node.js]: ../samples/resources/nodejs.png "Recursion understanding"
[node.js no title]: ../samples/resources/nodejs.png
