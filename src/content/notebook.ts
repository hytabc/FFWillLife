import type { NotebookTemplate } from '../engine/types'

/**
 * 倾听者手记模板（PRD §5.6）。
 *
 * 手记**不评定优劣**。它只陈述"这一周目里，发生了什么"——
 * 玩家读完应该感到被理解，而不是被打分。
 *
 * 占位符：{fulfilled} {sacrificed} {fulfilledCount} {sacrificedCount}
 * 判定顺序：priority 升序取第一个命中；最后一条无 match 的模板是兜底。
 */
export const notebookTemplates: NotebookTemplate[] = [
  {
    id: 'notebook:all-alone',
    priority: 10,
    match: { fulfillment: [0], sacrifice: [0] },
    body:
      '倾听者：\n\n' +
      '这一周目里，你没有让任何人特别好过，也没有让谁真的掉队。\n\n' +
      '所有人的结局都停在了中间——像一场谁也没有赢、但谁也没有退出的副本。\n\n' +
      '这或许是最接近"公平"的一种结果：你让每个人都自己承担了选择的后果。\n\n' +
      '但公平有时候也意味着，没有人被真正接住。',
  },
  {
    id: 'notebook:everyone-held',
    priority: 20,
    match: { fulfillment: [7, 8], sacrifice: [0] },
    body:
      '倾听者：\n\n' +
      '你几乎接住了所有人。{fulfilled}都走到了他们自己都没敢想过的位置。\n\n' +
      '但我注意到，这份成全并不便宜——总有人在这条路上替你付了钱，' +
      '只不过这一周目里，那个人是你自己。\n\n' +
      '你在每一封信里都选择了让事情变好的那一种排列。这是很累的一件事。',
  },
  {
    id: 'notebook:self-sacrifice',
    priority: 30,
    match: { inclination: ['self-sacrifice'], fulfillment: [2, 3, 4, 5] },
    body:
      '倾听者：\n\n' +
      '你成全了{fulfilled}，代价是{sacrificed}。\n\n' +
      '这不是一个错误的选择——你我都清楚，这世上本来就没有能让所有人同时向前走的那一种排列。\n\n' +
      '你只是比别人更早地承认了这一点，然后动手去选。\n\n' +
      '被辜负的人不会知道有人替他们做过权衡。而你会记得。',
  },
  {
    id: 'notebook:let-them-choose',
    priority: 40,
    match: { inclination: ['let-them-choose'] },
    body:
      '倾听者：\n\n' +
      '你没有替任何人做决定。\n\n' +
      '每一封信里，你都让那句话留在它本来该在的位置上，让说话的人自己承担了说出口的后果。\n\n' +
      '这需要克制——比动手改变要难得多。\n\n' +
      '有些人因此错过了本可以属于他们的东西。但他们错过的方式，是他们自己的。',
  },
  {
    id: 'notebook:balanced-low',
    priority: 50,
    match: { balance: [3], fulfillment: [0, 1, 2], sacrifice: [0, 1, 2] },
    body:
      '倾听者：\n\n' +
      '你走得很轻。这一周目里，没有谁被你高高托起，也没有谁因为你而坠落。\n\n' +
      '{fulfilled}得到了一点点好东西，{sacrificed}失去了一点点原本握着的。\n\n' +
      '这大概就是艾欧泽亚大多数时候的样子——不轰烈，也不残忍，只是持续推进着。',
  },
  {
    id: 'notebook:heavy-cost',
    priority: 60,
    match: { sacrifice: [5, 6, 7, 8] },
    body:
      '倾听者：\n\n' +
      '你让{sacrificed}停下了脚步。\n\n' +
      '也许你是对的——有些人确实需要先被现实按住一次，才知道自己要去哪里。\n\n' +
      '但请你记得：他们不是在故事里退场的角色，他们是真的上过线的人。\n\n' +
      '这一周目的账，我替你记下了。',
  },
  {
    id: 'notebook:one-held-one-lost',
    priority: 70,
    match: { fulfillment: [1], sacrifice: [1] },
    body:
      '倾听者：\n\n' +
      '你把所有的力气都用在了一个人身上：{fulfilled}。\n\n' +
      '而{sacrificed}为此退到了故事边缘。\n\n' +
      '你做出的是一个很明确的选择，明确得几乎不需要犹豫。\n\n' +
      '我只想问一句：如果重来一次，你还会选同一个人吗？',
  },
  {
    id: 'notebook:quiet-turn',
    priority: 80,
    match: { balance: [2] },
    body:
      '倾听者：\n\n' +
      '这一周目走得很稳。{fulfilled}向前走了一步，{sacrificed}向后退了一步。\n\n' +
      '没有人被彻底成全，也没有人被彻底辜负。\n\n' +
      '如果把艾欧泽亚所有的固定队翻一遍，大多数大概都是这个样子——' +
      '大家各自走了一段，然后换了方向。',
  },
  {
    id: 'notebook:default',
    // 兜底：无 match。必须有且仅有一条（校验器 9 断言）。
    priority: 999,
    body:
      '倾听者：\n\n' +
      '这一周目结束了。{fulfilled}得到了他们想要的，{sacrificed}没有。\n\n' +
      '我无法告诉你这是不是最好的那一种因果——因为本来就不存在最好的那一种。\n\n' +
      '唯一被称为"真结局"的，是你在完全理解他们之后，主动选择的那一个。\n\n' +
      '你选完了。这就是它了。',
  },
]
