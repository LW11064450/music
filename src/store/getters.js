
/* 取数据到组件中 */

/* 歌手相关数据 */
export const singer = state => state.singer

/* 是否播放 */
export const playing = state => state.playing
/* 是否全屏播放 */
export const fullScreen = state => state.fullScreen
/* 播放列表 */
export const playlist = state => state.playlist
/* 顺序播放列表 */
export const sequenceList = state => state.sequenceList
/* 播放模式 */
export const mode = state => state.mode
/* 当前播放歌曲索引 */
export const currentIndex = state => state.currentIndex
/* 当前播放歌曲 */
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
/* 推荐列表每条相关数据 */
export const disc = (state) => {
  return state.disc
}

/* 排行榜歌曲信息 */
export const toplist = (state) => {
  return state.toplist
}
