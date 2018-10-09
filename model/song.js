/**
 * 歌曲类模型
 */
const { BaseSong, Album, Singer } = require('./base.js');

class Song extends BaseSong {
    constructor ({ id, mid, name, singer, album, duration, musicType, privilege = null }) {
        super({ name, singer }); // 歌曲名称 歌手
        this.id = id; // 歌曲ID
        this.mid = mid; // 歌曲ID
        this.album = album; // 专辑
        this.duration = duration; // 时长
        if (privilege !== null) {
            this.privilege = privilege; // 是否能播放
        }
        this.musicType = musicType; // 来源平台
    }
}

// 格式化歌手
function formatSinger (singers) {
    return singers.reduce((arr, item) => {
        arr.push(
            new Singer({
                id: item.id,
                mid: item.id,
                name: item.name
            })
        );
        return arr;
    }, []);
}

function filterSinger (singers) {
    let arr = [];
    singers.forEach(item => {
        arr.push(item.name);
    });
    return arr.join('/');
}

// 格式化歌曲数据
function formatSongs (data, type) {
    switch (type) {
    case 'QQ':
        return data.reduce((arr, item) => {
            const data = item.data;
            if (data.songid && data.songmid) {
                arr.push(
                    new Song({
                        id: data.songid,
                        mid: data.songmid,
                        name: data.songname,
                        singer: data.singer,
                        album: new Album({
                            id: data.albumid,
                            mid: data.albummid,
                            name: data.albumname,
                            picUrl: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`
                        }),
                        duration: data.interval,
                        musicType: 'QQ'
                    })
                );
            }
            return arr;
        }, []);
    case '163':
        return data.reduce((arr, item) => {
            if (item.id) {
                arr.push(
                    new Song({
                        id: item.id,
                        mid: item.id,
                        name: item.name,
                        singer: formatSinger(item.ar),
                        album: new Album({
                            id: item.al.id,
                            mid: item.al.id,
                            name: item.al.name,
                            picUrl: item.al.picUrl || null
                        }),
                        duration: item.dt / 1000,
                        musicType: '163'
                    })
                );
            }
            return arr;
        }, []);
    default:
        return data;
    }
}

module.exports = {
    filterSinger,
    Song,
    formatSongs
};
