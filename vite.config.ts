import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  build: {
    /**
     * 单 chunk 体积上限。
     *
     * 实测：主 chunk 约 580 KB（gzip 180 KB），其中**大头是游戏自己的文本**——
     * `src/content/` 有 504 KB 源码，光是 33 封信的正文与结局段落就占 344 KB。
     * 库的体积反而很小（React + dnd-kit + d3-shape 摇树后占比不高）。
     *
     * 也就是说这不是"依赖塞爆了 bundle"，而是"一个以文字为核心的游戏必须带上它的文字"。
     * 真要再压，只能把章节正文按需加载——那需要把内容拆成"元数据（进度树要用）"
     * 与"正文（打开信件才要）"两部分，是一笔划算但独立的重构，不该顺手做。
     *
     * 因果树（依赖 d3-shape）已经单独拆出去了，见 src/ui/App.tsx。
     */
    chunkSizeWarningLimit: 700,
  },
  test: {
    // 引擎是纯函数，无 DOM 依赖；连续性校验器也只需 Node 环境。
    // 需要 DOM 的组件测试单独用 `// @vitest-environment jsdom` 标注。
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
