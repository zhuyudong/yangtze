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
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import data from '@/app/(unauth)/python/bing_wallpaper.json'
// import Inline from "yet-another-react-lightbox/plugins/inline"
import NextJsImage from '@/components/NextJsImage'

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

  return (
    <div className="my-4">
      <Masonry
        columnsCount={4}
        gutter="10px"
        // columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
      >
        {data.map((i, ix) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            key={i.title}
            data-index={ix}
            src={i.image_url}
            className="block w-full cursor-pointer"
            onClick={handleChangeIndex}
          />
        ))}
      </Masonry>
      <Lightbox
        open={index !== null}
        index={index ?? 0}
        plugins={[Captions, Counter, Download, Slideshow, Thumbnails, Zoom]}
        close={() => setIndex(null)}
        // slides={slides}
        slides={data.map(i => ({
          src: i.image_url,
          title: `${i.headline}[${i.title}]`,
          description: `${i.main_text}。${i.description}`
        }))}
        render={{ slide: NextJsImage }}
      />
    </div>
  )
}
