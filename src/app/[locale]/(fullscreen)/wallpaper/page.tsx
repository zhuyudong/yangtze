'use client'

import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'
import './page.css'

import { useCallback, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
// import Inline from 'yet-another-react-lightbox/plugins/inline'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import NextJsImage from '@/components/next-js-image'
import images from '@/resources/bing_wallpaper.json'

export default function Wallpaper() {
  const [index, setIndex] = useState<null | number>(null)

  const handleChangeIndex = useCallback(
    (e: React.MouseEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>) => {
      setIndex(
        e.currentTarget.dataset.index
          ? Number(e.currentTarget.dataset.index)
          : null
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index]
  )

  return (
    <div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 xl:gap-x-8"
      >
        {images.map((file, ix) => (
          <li
            key={`${file.headline}-${ix}`}
            className="relative"
            data-index={ix}
            onClick={handleChangeIndex}
          >
            <div className="aspect-h-7 aspect-w-10 group block w-full overflow-hidden rounded-none bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img
                // src={file.url}
                src={file.image_url}
                alt=""
                className="pointer-events-none object-cover group-hover:opacity-75"
              />
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {file.title}</span>
              </button>
            </div>
            {/* <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.title}</p> */}
            {/* <p className="pointer-events-none block text-sm font-medium text-gray-500">{file.description}</p> */}
          </li>
        ))}
      </ul>
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
          src: i.image_url,
          // src: i.url,
          title: `${i.headline}[${i.title}]`,
          description: `${i.main_text}。${i.description}`
        }))}
        render={{ slide: NextJsImage }}
      />
    </div>
  )
}
