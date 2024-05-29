<script setup>
function allowFullscreen() {
  if (checkFullscreen()) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

function checkFullscreen() {
  return document.fullscreenElement
}
</script>

<template>
  <a @click="allowFullscreen" type="button"
     class="bg-transparent m-2 position-fixed top-0"
     style="aspect-ratio: 1; z-index: 1500; height: 7rem">
  </a>
  <router-view/>
  <div hidden>
    <svg viewBox="0 0 200 200" xmlns='http://www.w3.org/2000/svg'>
      <filter id='noiseFilter'>
        <feTurbulence
            result="turbulence"
            type='fractalNoise'
            baseFrequency='0.65'
            numOctaves='3'
            stitchTiles='stitch'/>
        <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
        />
      </filter>
    </svg>
  </div>

</template>

<style scoped>

</style>
