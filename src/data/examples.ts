export interface IExample {
  name: string,
  text: string
}

const examples: IExample[] = [
  {
    name: '剪刀石頭布',
    text: `
      only 1 of {我出剪刀, 我出石頭, 我出布}
      only 1 of {你出剪刀, 你出石頭, 你出布}
      only 1 of {我贏, 你贏, 平手}

      我出剪刀 and 你出布  implies 我贏
      我出石頭 and 你出剪刀  implies 我贏
      我出布 and 你出石頭  implies 我贏

      你出剪刀 and 我出布  implies 你贏
      你出石頭 and 我出剪刀  implies 你贏
      你出布 and 我出石頭  implies 你贏

      我出剪刀 and 你出剪刀  implies 平手
      我出石頭 and 你出石頭  implies 平手
      我出布 and 你出布 implies 平手
    `
  }, {
    name: '四皇后',
    text: `
      only 1 of {1a, 1b, 1c, 1d}
      only 1 of {2a, 2b, 2c, 2d}
      only 1 of {3a, 3b, 3c, 3d}
      only 1 of {4a, 4b, 4c, 4d}


      only 1 of {1a, 2a, 3a, 4a}
      only 1 of {1b, 2b, 3b, 4b}
      only 1 of {1c, 2c, 3c, 4c}
      only 1 of {1d, 2d, 3d, 4d}

      at most 1 of {1a}
      at most 1 of {2a, 1b}
      at most 1 of {3a, 2b, 1c}
      at most 1 of {4a, 3b, 2c, 1d}
      at most 1 of {4b, 3c, 2d}
      at most 1 of {4c, 3d}
      at most 1 of {4d}

      at most 1 of {1d}
      at most 1 of {1c, 2d}
      at most 1 of {1b, 2c, 3d}
      at most 1 of {1a, 2b, 3c, 4d}
      at most 1 of {2a, 3b, 4c}
      at most 1 of {3a, 4b}
      at most 1 of {4a}


    `
  }
]
for (const example of examples) {
  // remove unnecessary blanks
  example.text = example.text
    .replace(/^[ \n]*/, '')
    .replace(/[ \n]*\n$/, '')
    .replace(/[ ]*\n[ ]*/g, '\n')
}

export default examples
