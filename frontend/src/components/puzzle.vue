<script setup>
import headbreaker from 'headbreaker';
import {onMounted, ref, defineEmits, onUpdated} from "vue";

const props = defineProps(['img_url', 'rows', 'cols', 'strokeSoftness', 'strokeColor', 'strokeWidth', 'shuffle', 'context'])

function calcPieceSize(width, height, rows, columns, elSize) {
  /*
  Функция считает размер кусочков пазла исходя из размеров изображения, размеров холста, кол-ва столбцов и строк
  @width: Ширина изображения
  @height: Высота изображения
  @rows: Кол-во строк
  @columns: Кол-во столбцов
  @elSize: Размеры холста
  @pieceSize: Размер кусочка пазла
  */
  let scale_divider = 1
  if (width > elSize.width - 50 || height > elSize.height - 50) {
    while ((elSize.width - 50 < width) || elSize.height - 50 < height) {
      width /= scale_divider
      height /= scale_divider
      scale_divider += 0.01
    }
  } else {
    while ((elSize.width - 50 > width) || elSize.height - 50 > height) {
      width /= scale_divider
      height /= scale_divider
      scale_divider -= 0.01
    }
  }

  const pieceWidth = width / columns;
  const pieceHeight = height / rows;
  return {x: pieceWidth, y: pieceHeight}
}

const el = ref()
const img_el = ref()

const emit = defineEmits(['solved', 'scrolled'])
let canvas = null

const drawPuzzle = () => {
  let pieceSize = calcPieceSize(img_el.value.width, img_el.value.height, props.rows, props.cols, el.value.getBoundingClientRect())
  canvas = new headbreaker.Canvas('puzzle', {
    width: el.value.getBoundingClientRect().width,
    height: el.value.getBoundingClientRect().height,
    pieceSize: pieceSize,
    fixed: true, preventOffstageDrag: true,
    proximity: 20, borderFill: {x: pieceSize.x / 10, y: pieceSize.y / 10},
    strokeWidth: props.strokeWidth, strokeColor: props.strokeColor,
    lineSoftness: props.strokeSoftness, image: img_el.value,
    maxPiecesCount: {x: props.cols, y: props.rows},
    painter: new headbreaker.painters.Konva()
  });

  canvas.adjustImagesToPuzzleHeight();
  canvas.adjustImagesToPuzzleWidth()

  canvas.autogenerate({
    horizontalPiecesCount: props.cols,
    verticalPiecesCount: props.rows
  });
  if (props.shuffle) {
    canvas.shuffle(0.8);
  }

  if (props.context === 'view') {
    el.value.addEventListener("mousewheel", function (e) {
      zoom(e.deltaY)
    })
  }

  canvas.reframeWithinDimensions()
  canvas.draw();

  canvas.attachSolvedValidator();
  canvas.onValid(() => {
    setTimeout(() => {
      emit('solved')
    }, 1000)
  })

};

onUpdated(() => {
  drawPuzzle()
})

onMounted(() => {
  img_el.value.onload = () => {
    drawPuzzle()
  }
})
</script>

<template>
  <img hidden="hidden" ref="img_el" :src="props.img_url"/>
  <div ref="el" id="puzzle"></div>
</template>

<style scoped>
#puzzle {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 40rem;
}
</style>