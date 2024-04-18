'use client'

import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'
import './page.css'

import { useCallback, useState } from 'react'
import Masonry from 'react-responsive-masonry'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
// import Inline from 'yet-another-react-lightbox/plugins/inline'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import NextJsImage from '@/components/NextJsImage'
// import styles
// import 'lightgallery/css/lightgallery.css'
// import 'lightgallery/css/lg-autoplay.css'
// import 'lightgallery/css/lg-comments.css'
// import 'lightgallery/css/lg-fullscreen.css'
// import 'lightgallery/css/lg-medium-zoom.css'
// import 'lightgallery/css/lg-pager.css'
// import 'lightgallery/css/lg-relative-caption.css'
// import 'lightgallery/css/lg-rotate.css'
// import 'lightgallery/css/lg-share.css'
// import 'lightgallery/css/lg-thumbnail.css'
// import 'lightgallery/css/lg-transitions.css'
// import 'lightgallery/css/lg-video.css'
// import 'lightgallery/css/lg-zoom.css'
// import './page.css'
// import lgAutoplay from 'lightgallery/plugins/autoplay'
// import lgComment from 'lightgallery/plugins/comment'
// import lgFullscreen from 'lightgallery/plugins/fullscreen'
// import lgMediumZoom from 'lightgallery/plugins/mediumZoom'
// import lgPager from 'lightgallery/plugins/pager'
// import lgRelativeCaption from 'lightgallery/plugins/relativeCaption'
// import lgRotate from 'lightgallery/plugins/rotate'
// import lgShare from 'lightgallery/plugins/share'
// import lgThumbnail from 'lightgallery/plugins/thumbnail'
// import lgVideo from 'lightgallery/plugins/video'
// import lgZoom from 'lightgallery/plugins/zoom'
// import LightGallery from 'lightgallery/react'
import images from '@/resources/bing_wallpaper.json'

// const slides = [
//   {
//     src: 'https://yet-another-react-lightbox.com/images/image01.jpeg',
//     width: 3840,
//     height: 5760
//   },
//   {
//     src: 'https://yet-another-react-lightbox.com/images/image02.jpeg',
//     width: 3840,
//     height: 5070
//   },
//   {
//     src: 'https://yet-another-react-lightbox.com/images/image03.jpeg',
//     width: 3840,
//     height: 5120
//   }
// ]

export default function WallpaperLightbox() {
  // const [open, setOpen] = useState(false)
  const [index, setIndex] = useState<null | number>(null)

  const handleChangeIndex = useCallback(
    (
      e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>
    ) => {
      setIndex(
        e.currentTarget.dataset.index
          ? Number(e.currentTarget.dataset.index)
          : null
      )
    },
    [index]
  )

  // const onInit = () => {
  //   console.log('lightGallery has been initialized')
  // }

  return (
    <div className="my-4">
      <Masonry
        columnsCount={5}
        gutter="10px"
        // columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
      >
        {images.map((i, ix) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            alt=""
            key={i.title}
            data-index={ix}
            // src={i.image_url}
            src={i.url}
            className="block w-full cursor-pointer"
            onClick={handleChangeIndex}
          />
        ))}
      </Masonry>
      <Lightbox
        open={index !== null}
        index={index ?? 0}
        plugins={[
          Captions,
          Counter,
          Download,
          Slideshow,
          // Inline,
          Thumbnails,
          Zoom
        ]}
        close={() => setIndex(null)}
        // slides={slides}
        slides={images.map(i => ({
          // src: i.image_url,
          src: i.url,
          title: `${i.headline}[${i.title}]`,
          description: `${i.main_text}。${i.description}`
        }))}
        render={{ slide: NextJsImage }}
      />
      {/* <LightGallery
        // onInit={onInit}
        speed={500}
        plugins={[
          lgAutoplay,
          lgComment,
          lgFullscreen,
          lgMediumZoom,
          lgPager,
          lgRelativeCaption,
          lgRotate,
          lgShare,
          lgThumbnail,
          lgVideo,
          lgZoom
        ]}
      >
        {data.map(i => (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <a href={i.url} key={i.date} className="grid-item">
            <img alt="" src={i.url} />
          </a>
        ))}
      </LightGallery> */}
    </div>
  )
}
