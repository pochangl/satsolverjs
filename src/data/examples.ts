export interface IExample {
  name: string,
  text: string,
  choices?: {
    [key: string]: string[]
  }
}

const examples: IExample[] = [
  {
    name: '剪刀石頭布',
    text: `
      only 1 of {我出剪刀, 我出石頭, 我出布}
      only 1 of {你出剪刀, 你出石頭, 你出布}
      only 1 of {我贏, 你贏, 平手}

      我出剪刀 and 你出布 implies 我贏
      我出石頭 and 你出剪刀 implies 我贏
      我出布 and 你出石頭 implies 我贏

      你出剪刀 and 我出布 implies 你贏
      你出石頭 and 我出剪刀 implies 你贏
      你出布 and 我出石頭 implies 你贏

      我出剪刀 and 你出剪刀 implies 平手
      我出石頭 and 你出石頭 implies 平手
      我出布 and 你出布 implies 平手
    `
  }, {
    name: '八皇后',
    text: `
      only 1 of {1a, 1b, 1c, 1d, 1e, 1f, 1g, 1h}
      only 1 of {2a, 2b, 2c, 2d, 2e, 2f, 2g, 2h}
      only 1 of {3a, 3b, 3c, 3d, 3e, 3f, 3g, 3h}
      only 1 of {4a, 4b, 4c, 4d, 4e, 4f, 4g, 4h}
      only 1 of {5a, 5b, 5c, 5d, 5e, 5f, 5g, 5h}
      only 1 of {6a, 6b, 6c, 6d, 6e, 6f, 6g, 6h}
      only 1 of {7a, 7b, 7c, 7d, 7e, 7f, 7g, 7h}
      only 1 of {8a, 8b, 8c, 8d, 8e, 8f, 8g, 8h}

      only 1 of {1a, 2a, 3a, 4a, 5a, 6a, 7a, 8a}
      only 1 of {1b, 2b, 3b, 4b, 5b, 6b, 7b, 8b}
      only 1 of {1c, 2c, 3c, 4c, 5c, 6c, 7c, 8c}
      only 1 of {1d, 2d, 3d, 4d, 5d, 6d, 7d, 8d}
      only 1 of {1e, 2e, 3e, 4e, 5e, 6e, 7e, 8e}
      only 1 of {1f, 2f, 3f, 4f, 5f, 6f, 7f, 8f}
      only 1 of {1g, 2g, 3g, 4g, 5g, 6g, 7g, 8g}
      only 1 of {1h, 2h, 3h, 4h, 5h, 6h, 7h, 8h}

      at most 1 of {1a}
      at most 1 of {2a, 1b}
      at most 1 of {3a, 2b, 1c}
      at most 1 of {4a, 3b, 2c, 1d}
      at most 1 of {5a, 4b, 3c, 2d, 1e}
      at most 1 of {6a, 5b, 4c, 3d, 2e, 1f}
      at most 1 of {7a, 6b, 5c, 4d, 3e, 2f, 1g}
      at most 1 of {8a, 7b, 6c, 5d, 4e, 3f, 2g, 1h}
      at most 1 of {8b, 7c, 6d, 5e, 4f, 3g, 2h}
      at most 1 of {8c, 7d, 6e, 5f, 4g, 3h}
      at most 1 of {8d, 7e, 6f, 5g, 4h}
      at most 1 of {8e, 7f, 6g, 5h}
      at most 1 of {8f, 7g, 6h}
      at most 1 of {8g, 7h}
      at most 1 of {8h}

      at most 1 of {1h}
      at most 1 of {1g, 2h}
      at most 1 of {1f, 2g, 3h}
      at most 1 of {1e, 2f, 3g, 4h}
      at most 1 of {1d, 2e, 3f, 4g, 5h}
      at most 1 of {1c, 2d, 3e, 4f, 5g, 6h}
      at most 1 of {1b, 2c, 3d, 4e, 5f, 6g, 7h}
      at most 1 of {1a, 2b, 3c, 4d, 5e, 6f, 7g, 8h}
      at most 1 of {2a, 3b, 4c, 5d, 6e, 7f, 8g}
      at most 1 of {3a, 4b, 5c, 6d, 7e, 8f}
      at most 1 of {4a, 5b, 6c, 7d, 8e}
      at most 1 of {5a, 6b, 7c, 8d}
      at most 1 of {6a, 7b, 8c}
      at most 1 of {7a, 8b}
      at most 1 of {8a}
    `
  }, {
    name: 'Package manager',
    text: `
      only 1 of {A=1.0, A=1.1}
      only 1 of {B=2.0, B=2.1, B=2.2, B=2.3, B=2.4}
      only 1 of {C=3.0, C=3.1}

      A=1.0 implies B=2.0 or B=2.1 or B=2.3 or B=2.4
      A=1.1 implies B=2.1 or B=2.2 or B=2.4
      C=3.0 implies A=1.0 or A=1.1 or B=2.0
      C=3.1 implies A=1.1
      C=3.1 implies B=2.4
    `,
    choices: {
      'C': ['C=3.0', 'C=3.1']
    }
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
