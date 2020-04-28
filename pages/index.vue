<template>
  <div>
    <video id="theirVideo" autoplay playsinline />
    <video id="myVideo" muted="true" autoplay playsinline />
    <div>
      マイク:
      <select v-model="selectedAudio" @change="onChange">
        <option disabled value="">Please select one</option>
        <option v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value">
          {{ audio.text }}
        </option>
      </select>
      カメラ:
      <select v-model="selectedVideo" @change="onChange">
        <option disabled value="">Please select one</option>
        <option v-for="(video, key, index) in videos" v-bind:key="index" :value="video.value">
          {{ video.text }}
        </option>
      </select>
      <div>
        <input v-model="callToId" placeholder="call id">
        <button @click="makeCall" class="button--green">Call</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Peer from 'skyway-js'

type LocalData = {
  selectedAudio: string
  selectedVideo: string
  audios: Audios[]
  videos: Videos[]
  // localStream: MediaStream
  peerId: string
  callToId: string
}

// type MediaStream = {
//   id: string
//   active: boolean
//   onaddtrack: void | null
//   onremovetrack: void | null
//   onactive: void | null
//   oninactive: void | null
// }

type Audios = {
  text: string
  value: string
}

type Videos = {
  text: string
  value: string
}

export default Vue.extend<any, any, any>({
  async asyncData() {
    const peer = new Peer({
      key: `${process.env.API_KEY}`,
      debug: 3,
    })
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    return {
      peer,
      localStream
    }
  },
  data: () :LocalData => ({
    selectedAudio: '',
    selectedVideo: '',
    audios: [],
    videos: [],
    peerId: '',
    callToId: ''
  }),
  mounted() {
    // const peer = new Peer({
    //   key: `${process.env.API_KEY}`,
    //   debug: 3,
    // })
    this.peer.on('open', () => {
      this.peerId = this.peer.id
    })
    // peer.on('call', call => {
    //   call.answer(this.localStream)
    //   this.connect(call)
    // })
    navigator.mediaDevices.enumerateDevices()
      .then((deviceInfos) => {
        console.log(deviceInfos)
        for (let i = 0; i !== deviceInfos.length; ++i) {
          const deviceInfo = deviceInfos[i]
          if (deviceInfo.kind === 'audioinput') {
            this.audios.push({
              text: deviceInfo.label ||
              `Microphone ${this.audios.length + 1}`,
              value: deviceInfo.deviceId
            })
          } else if (deviceInfo.kind === 'videoinput') {
            this.videos.push({
              text: deviceInfo.label ||
              `Camera  ${this.videos.length - 1}`,
              value: deviceInfo.deviceId
            })
          }
        }
      })
  },
  methods: {
    onChange() {
      console.log('abas', this.selectedAudio)
      console.log('abas', this.selectedVideo)
      if (this.selectedAudio !== '' || this.selectedVideo !== '') {
        this.connectLocalCamera()
      }
    },
    async connectLocalCamera() {
      const constraints = {
        audio: this.selectedAudio ? { deviceId: { exact: this.selectedAudio } } : false,
        video: this.selectedVideo ? { deviceId: { exact: this.selectedVideo } } : false
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.localStream = stream
      console.log(this.localStream)
      document.getElementById('myVideo').srcObject = this.localStream
      // this.makeCall()
    },
    makeCall() {
      console.log('makeCall')
      const call = this.peer.call(this.callToId, this.localStream)
      this.connect(call)
    },
    connect(call) {
      // call.on('stream', stream => {
      //   const el = document.getElementById('their-video')
      //   el.srcObject = stream
      //   el.play()
      // })
    }
  }
})
</script>
