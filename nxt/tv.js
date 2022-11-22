/* NxtDigital_Kochi */
const streams = {
    "BabyStar_sd": 'https://cdnus.ylivestream.com/babystar_sd/video.m3u8',
    "KCN_sd": 'https://cdnus.ylivestream.com/kcn_sd/video.m3u8',
    "Easyenglish_sd": 'https://cdnus.ylivestream.com/easyenglish_sd/video.m3u8',
    "Vachanamtv_sd": "https://cdnus.ylivestream.com/vachanamtv_sd/video.m3u8",
    "Rajnews_sd": 'https://cdnus.ylivestream.com/rajnews_sd/video.m3u8',
    "Rajmusix_sd": 'https://cdnus.ylivestream.com/rajmusix_sd/video.m3u8',
    "C27_sd": 'https://cdnus.ylivestream.com/c27_sd/video.m3u8',
    "Elnmuzikz_sd": 'https://cdnus.ylivestream.com/elnmuzikz_sd/video.m3u8',
    
}
const getIndex = name => playing.findIndex(s => s.name === name)

let playing, listen, dragging

document.addEventListener('alpine:init', () => {

    playing = Alpine.reactive([])
    listen = Alpine.reactive({})

    Alpine.data('listen', () => ({on: ''}))
    Alpine.data('streams', () => ({streams}))
    Alpine.data('playing', () => ({
            playing,
            replace(prev, next) {
                if (listen.on === prev)
                    listen.on = next
                new Video(next, getIndex(prev))
            }
        }))

    Alpine.magic('isPlaying', () => name => playing.find(s => s.name === name))
    Alpine.magic('listening', () => name => listen.on === name)
    Alpine.magic('size', () => {
        switch (true) {
            case (playing.length > 16):
                return "col-lg-2"
                break
            case (playing.length > 9):
                return "col-lg-3"
                break
            case (playing.length > 4):
                return "col-lg-4"
                break
            case (playing.length > 1):
                return "col-lg-6"
                break
            default:
                return "col-lg-12"
        }
    })
    Alpine.magic('stop', () => name => {
            if (listen.on === name)
                listen.on = ''
            playing[getIndex(name)].hls.destroy()
            playing.splice(getIndex(name), 1)
        })
})

class Video {
    constructor(name, index = '') {
        this.name = name
        this.src = streams[name]
        this.index = index
        this.mountVideo()
    }
    hls() {
        if (Hls.isSupported()) {
            let hls = new Hls()
            hls.loadSource(this.src)
            return hls
        }
    }
    mountVideo() {
        let object = {'name': this.name, 'hls': this.hls()}
        if (this.index !== '') {
            playing[this.index].hls.destroy()
            playing.splice(this.index, 1, object)
        } else
            playing.push(object)
    }
}
