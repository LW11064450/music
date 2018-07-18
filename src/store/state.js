import {playMode} from 'common/js/config'

const state = {
  /* 歌手信息 */
  singer: {},
  /* 是否在播放 */
  playing: false,
  /* 是否全屏播放 */
  fullScreen: false,
  /* 播放列表 */
  playlist: [],
  /* 顺序播放列表 */
  sequenceList: [],
  /* 播放模式 */
  mode: playMode.sequence,
  /* 当前播放歌曲索引 */
  currentIndex: -1,
  /* 推荐列表歌曲目录信息 */
  disc: {},
  /* 排行榜歌曲信息 */
  toplist: {}
}

export default state
