# cubb

`cubb`是一种命令行的文本标记语言，用于输出更友好的命令行文本。

## 安装与使用

### 安装

```bash
$ npm install cubb --save
```

### 使用

```javascript
var options = {};
var Cubb = require('cubb');
var cubb = new Cubb(options);
cubb.render('<b>some text</b>');
```

## 选项

构造函数支持传入渲染选项

* options.tab: 如果显示`\t`，默认为4空格
* options.box: 盒子渲染选项
* options.box.margin: 盒子与前后内容之间的行距，默认为1行
* options.box.padding: 盒子左内补，默认为2空格
* options.box.borderColor: 边框颜色，默认为'yellow'
* options.box.paddingVertical: 盒子内垂直间距，默认为0行
* options.box.paddingHorizontal: 盒子内水平间距，默认为1空格
* options.list: 列表渲染选项
* options.list.style: 列表项修饰符号
* options.list.space: 列表项与列表项之间的行距，默认为0行
* options.list.margin: 列表与前后内容之间的行距，默认为1行
* options.list.padding: 列表左内补，默认为2空格
* options.table: 表格渲染选项
* options.table.margin: 表格与前后内容之间的行距，默认为1行
* options.table.padding: 表格左内补，默认为2空格
* options.table.rowSpace: 两行之间的行距，默认为0行
* options.table.colSpace: 两个单元格之间的间距，默认为4空格
* options.table.titlePadding: 标题行左内补，默认为2空格

## 方法

### render(text，options)

将标记文本渲染成可以在命令行正确显示的文本。

* text: 要渲染的完整文本内容
* options: 同选项，只对当前渲染有效

### clean(text)

清除所有标记样式。

## 语法

所有语法标签都支持嵌套使用。

### 粗体

```html
<b>some text</b>
```

```markdown
[b]some text[/b]
```

### 斜体

```html
<b>some text</b>
```

```markdown
[b]some text[/b]
```

### 下划线

```html
<u>some text</u>
```

```markdown
[u]some text[/u]
```

### 弱化

```html
<d>some text</d>
```

```markdown
[d]some text[/d]
```

### 文本颜色

支持的颜色: black，red，green，yellow，blue，magenta，cyan，white，gray，redBright，greenBright，yellowBright，blueBright，magentaBright，cyanBright，whiteBright。

```html
<red>some text</red>
```

```html
<color red>some text</color>
```

```markdown
[red]some text[/red]
```

```markdown
[color=red]some text[/color]
```

### 背景颜色

```html
<bgRed>some text</bgRed>
```

```html
<bgColor red>some text</bgColor>
```

```markdown
[bgRed]some text[/bgRed]
```

```markdown
[bgColor=red]some text[/bgColor]
```

### 列表

```markdown
* list item1
* list item2
* list item3
```

### 盒子

#### 单边框

```markdown
:----------------:
| some text      |
| some long text |
:----------------:
```

#### 双边框

```markdown
=================:
║ some text      ║
║ some long text ║
=================:
```

#### 文本对齐

通过在左边或者右边添加`:`可以指定盒子内部文本的对齐方式。

### 表格

#### 带表头表格

与markdown的表格一样，支持使用冒号定义单元格左右对齐方式。单元格的宽度是自动计算的，并不强行要求预先定义好。

`title`行是一个特殊的行，需要使用`[]`将标题文本内容包裹起来。

```markdown
| Feature                             | Chrome   | Edge         | Firefox (Gecko)  | Internet Explorer            | Opera  | Safari |
| ----------------------------------- | :------: | :----------: | :--------------: | :--------------------------: | :----: | :----: |
| [title 1]                                                                                                                         |
| Basic support                       | 38       | 12<u>[1]</u> | 36 (36)          | <red><b>No support</b></red> | 25     | 9      |
| Symbol.iterator (@@iterator)        | 38       | 12           | 36 (36)          | <red><b>No support</b></red> | 25     | 9      |
| [title 2]                                                                                                                         |
| Symbol.unscopables (@@unscopables)  | 38       | 12           | 48 (48)          | <red><b>No support</b></red> | 25     | 9      |
| Symbol.species (@@species)          | 51       | ?            | 41 (41)          | <red><b>No support</b></red> | ?      | ?      |
```

#### 无表头表格

暂不支持定义单元格左右对齐方式。

```markdown
| [<b>title 1</b>]                                                                                                                         |
| Basic support                       | 38       | 12<u>[1]</u> | 36 (36)          | <red><b>No support</b></red> | 25     | 9      |
| Symbol.iterator (@@iterator)        | 38       | 12           | 36 (36)          | <red><b>No support</b></red> | 25     | 9      |
| [<b>title 2</b>]                                                                                                                         |
| Symbol.unscopables (@@unscopables)  | 38       | 12           | 48 (48)          | <red><b>No support</b></red> | 25     | 9      |
| Symbol.species (@@species)          | 51       | ?            | 41 (41)          | <red><b>No support</b></red> | ?      | ?      |
```

## 与chalk对比

* `chalk`支持更多的颜色与样式定义

    `chalk`支持了一些只有在某些特定终端上才可以使用的特性，并在不兼容的时候做降级处理，`cubb`只实现了能够兼容所有终端的特性。

* 使用方式不同

    相比`chalk`采用api的方式，标记语言的方式使用起来更加直观方便。

* `cubb`支持`list`和`table`块的渲染

    `chalk`只处理纯文本的渲染，相对而言，`cubb`更适合用于大段内容的渲染。    
    
## 致谢

在实现`cubb`框架过程中，参考了`chalk`和`marked`的部分代码，在此表示感谢!