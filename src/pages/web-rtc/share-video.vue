<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <p-button @click="createConnection" :label="'Create'" />
                {{ id }}
            </div>
            <div class="col-12">
                <video ref="webcamVideo" autoplay playsinline></video>
            </div>
            <div class="col-6" v-for="remoteVideo in remoteVideos" :key="remoteVideo.id">
                <video ref="remoteVideo" :srcObject="remoteVideo" autoplay playsinline></video>
            </div>
            <div class="col-12">
                <p-input-text v-model="peerId" />
                <p-button @click="onAnswer" :label="'Answer'" />
                <p-button @click="startScreenShare" :label="'Start screen share'" />
                <p-button @click="stopScreenShare" :label="'Stop screen share'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { get, set } from '@vueuse/core'

import { MediaConnection, Peer } from 'peerjs'

import { v4 as uuid } from 'uuid'

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
}

export default defineComponent({
    setup() {
        const id = ref()

        const peerId = ref()

        const webcamVideo = ref()
        const remoteVideos: any[] = reactive([])
        const screenStream = ref()

        const localStream = ref()

        const screenSharing = ref(false)

        let peer!: Peer
        let currentCall!: MediaConnection

        onMounted(() => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((result) => {
                set(localStream, result)
                get(webcamVideo).srcObject = result
            })
        })

        const onAnswer = async () => {
            peer = new Peer({ config: servers })

            peer.on('open', () => {
                const call = peer.call(peerId.value, localStream.value)

                call.peerConnection.ontrack = (event: any) => {
                    event.streams.forEach((stream: any) => {
                        if (!remoteVideos.some((s) => s.id === stream.id)) {
                            remoteVideos.push(stream)
                        }
                    })
                }

                currentCall = call
            })
        }

        const createConnection = async () => {
            set(id, uuid())

            const peer = new Peer(get(id), {
                config: servers,
            })

            peer.on('call', (call: any) => {
                call.answer(get(localStream))

                call.peerConnection.ontrack = (event: any) => {
                    event.streams.forEach((stream: any) => {
                        if (!remoteVideos.some((s) => s.id === stream.id)) {
                            remoteVideos.push(stream)
                        }
                    })
                }

                currentCall = call
            })
        }

        const startScreenShare = () => {
            if (get(screenSharing)) {
                stopScreenShare()
            }

            navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
                set(screenStream, stream)
                const localTrack = get(localStream).getVideoTracks()[0]
                const videoTrack = stream.getVideoTracks()[0]
                videoTrack.onended = () => stopScreenShare()

                if (peer) {
                    let sender = currentCall.peerConnection.getSenders().find((sender: any) => sender?.track?.id === localTrack.id)
                    if (sender) {
                        sender.replaceTrack(videoTrack)
                        set(screenSharing, true)
                    }
                }
            })
        }

        const stopScreenShare = () => {
            if (!get(screenSharing)) return
            const screenTrack = get(screenStream).getVideoTracks()[0]
            const videoTrack = get(localStream).getVideoTracks()[0]

            if (peer) {
                const sender = currentCall.peerConnection.getSenders().find((sender: any) => sender?.track?.id === screenTrack.id)
                if (sender) {
                    sender.replaceTrack(videoTrack)
                }
            }

            get(screenStream)
                .getTracks()
                .forEach((track: any) => track.stop())
            set(screenSharing, false)
        }

        return {
            id,

            webcamVideo,
            remoteVideos,

            peerId,

            onAnswer,

            createConnection,
            startScreenShare,
            stopScreenShare,
        }
    },
})
</script>
