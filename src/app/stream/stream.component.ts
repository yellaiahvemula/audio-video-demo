import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, AfterViewInit {

  @ViewChild('videoElement') videoElement: ElementRef;
  @ViewChild('audioSource') audioSource: ElementRef;
  @ViewChild('videoSource') videoSource: ElementRef;
  @ViewChild('audioElement') audioElement: ElementRef;

  video: any;
  audio: any;
  displayControls: boolean;
  audioSources: any;
  videoSources: any;
  availableSources = false;
  browser = navigator as any;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.video = this.videoElement.nativeElement;
      this.audio = this.audioElement.nativeElement;
      this.audioSources = this.audioSource.nativeElement;
      this.videoSources = this.videoSource.nativeElement;

      this.browser.getUserMedia = (this.browser.getUserMedia ||
      this.browser.webkitGetUserMedia ||
      this.browser.mozGetUserMedia ||
      this.browser.msGetUserMedia);

      if (typeof MediaStreamTrack === 'undefined') {
        alert('This browser does not support MediaStreamTrack.getSources().');
      } else {
        this.browser.mediaDevices.enumerateDevices().then(availableSources => {
          this.gotSources(availableSources);
        });
      }

  }

    initCamera(config: any) {
    this.browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      this.video.play();
    });
  }

  initAudio(config: any) {
    this.browser.mediaDevices.getUserMedia(config).then(stream => {
      this.audio.srcObject = stream;
    });
  }

  gotSources(availableSources) {
    for (let i = 0; i !== availableSources.length; ++i) {
      const sourceInfo = availableSources[i];
      const option = this.renderer.createElement('option');
      option.value = sourceInfo.deviceId;
      if (sourceInfo.kind === 'audiooutput') {
        option.text = sourceInfo.label || 'microphone ' +
          (this.audioSources.length + 1);
        this.renderer.appendChild(this.audioSource.nativeElement, option);
      } else if (sourceInfo.kind === 'videoinput') {
        option.text = sourceInfo.label || 'camera ' + (this.videoSources.length + 1);
        this.renderer.appendChild(this.videoSource.nativeElement, option);
      } else {
        console.log('Some other kind of source: ', sourceInfo);
      }
    }
  }

  startCam() {
    this.initCamera({ video: true, audio: false });
  }
   soundWithCam() {
    this.initCamera({ video: true, audio: true });
  }

  pauseCam() {
    this.video.pause();
  }

  resumeCam() {
    this.video.play();
  }

  startAudio() {
    this.initAudio({ audio: true });
  }
}
