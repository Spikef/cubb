The new APIs in <u>ES6</u> come in three flavours: <b><red>Symbol</red></b>, <b><red>Reflect</red></b>, and <b><red>Proxy</red></b>. Upon first glance this might be a little confusing - three separate APIs all for metaprogramming? But it actually makes a lot of sense when you see how each one is split:

* <green>Symbols</green> are all about Reflection within implementation - you sprinkle them on your existing classes and objects to change the behaviour.
* <green>Reflect</green> is all about Reflection through introspection - used to discover very low level information about your code.
* <green>Proxy</green> is all about Reflection through intercession - wrapping objects and intercepting their behaviours through traps.

| Feature                             | Chrome   | Edge         | Firefox (Gecko)  | Internet Explorer            | Opera  | Safari |
| ----------------------------------- | :------: | :----------: | :--------------: | :--------------------------: | :----: | :----: |
| [<b>title 1</b>]                                                                                                           |
| Basic support                       | 38       | 12<u>[1]</u> | 36 (36)          | <red><b>No support</b></red> | 25     | 9      |
| Symbol.iterator (@@iterator)        | 38       | 12           | 36 (36)          | <red><b>No support</b></red> | 25     | 9      |
| [<b>title 2</b>]                                                                                                           |
| Symbol.unscopables (@@unscopables)  | 38       | 12           | 48 (48)          | <red><b>No support</b></red> | 25     | 9      |
| Symbol.species (@@species)          | 51       | ?            | 41 (41)          | <red><b>No support</b></red> | ?      | ?      |

[1] Edge 12 included Symbol properties in <u>JSON.stringify()</u> output.
