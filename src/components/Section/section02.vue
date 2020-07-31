<template lang="pug">
  section
    b-container(fluid :style="{background:'#52453c'}")
      b-row.h-100.py-3
        b-col.d-flex.justify-content-center.align-items-center(cols="12" sm="6")
          h4.py-3 關於我們的小故事
        b-col.d-flex.flex-wrap.flex-column.flex-sm-row.align-items-center(cols="12" sm="6")
          b-col.story(cols="0" sm="6").my-2
            img(src="https://picsum.photos/1920/1080/?random=65")
          b-col.story(cols="0" sm="6").my-2
            img(src="https://picsum.photos/1920/1080/?random=66")
          b-col.story(cols="0" sm="6").my-2
            img(src="https://picsum.photos/1920/1080/?random=67")
          b-col.story(cols="0" sm="6").my-2
            img(src="https://picsum.photos/1920/1080/?random=68")
</template>
