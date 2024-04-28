import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon
} from '@heroicons/react/20/solid'

const pageClass =
  'cursor-pointer inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
const currentPageClass =
  'cursor-pointer inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600'

export function Pagination({
  // prev,
  // next,
  total,
  pageNumber = 1,
  pageSize = 20,
  onClick
}: {
  // prev: number | null
  // next: number | null
  total: number
  pageSize: number
  pageNumber: number
  onClick: (pageNumber: number) => void
}) {
  const tail = Math.ceil(total / pageSize)
  // 当前页不在首尾，显示中间 3 页
  const mid =
    ![1, 2, 3, tail - 2, tail - 1, tail].includes(pageNumber) &&
    [...Array(pageNumber + 2)]
      .map((_, ix) => ix + 1)
      .filter(i => i >= pageNumber)
  const pages = [...Array(Math.ceil(total / pageSize))].map((_, ix) => ix + 1)

  return (
    <nav className="mt-16 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1 cursor-pointer">
        {pageNumber > 1 ? (
          <a
            onClick={() => onClick(pageNumber - 1)}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon
              className="mr-3 size-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </a>
        ) : null}
      </div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full border border-x-0 border-t-0 border-gray-300 py-1 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          // defaultValue={tabs.find(tab => tab.current)!.name}
          value={pageNumber}
          onChange={e => onClick(Number(e.target.value))}
        >
          {pages.map(i => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {/* 1, 2, 3 */}
        {[...Array(3)]
          .map((_, ix) => ix + 1)
          .map(i => (
            <a
              key={i}
              onClick={() => onClick(i)}
              className={i === pageNumber ? currentPageClass : pageClass}
              aria-current={i === pageNumber ? 'page' : undefined}
            >
              {i}
            </a>
          ))}
        {/* 4,5,6 */}
        {(mid && mid[0] > 4) || (pageNumber <= 3 && tail - 2 > 4) ? (
          <a
            onClick={() => onClick(pageNumber <= 3 ? 4 : pageNumber - 1)}
            className={pageClass}
          >
            ...
          </a>
        ) : null}
        {/* 7, 8, 9 */}
        {mid
          ? mid.map(i => (
              <a
                key={i}
                onClick={() => onClick(i)}
                className={i === pageNumber ? currentPageClass : pageClass}
                aria-current={i === pageNumber ? 'page' : undefined}
              >
                {i}
              </a>
            ))
          : null}
        {(mid && mid[mid.length - 1] < tail - 3) ||
        (pageNumber >= tail - 2 && tail - 2 > 4) ? (
          <a onClick={() => onClick(tail - 5)} className={pageClass}>
            ...
          </a>
        ) : null}
        {tail >= 10 && tail ? (
          <a
            onClick={() => onClick(tail - 2)}
            className={tail - 2 === pageNumber ? currentPageClass : pageClass}
            aria-current={tail - 2 === pageNumber ? 'page' : undefined}
          >
            {tail - 2}
          </a>
        ) : null}
        {tail >= 10 && tail ? (
          <a
            onClick={() => onClick(tail - 1)}
            className={tail - 1 === pageNumber ? currentPageClass : pageClass}
            aria-current={tail - 1 === pageNumber ? 'page' : undefined}
          >
            {tail - 1}
          </a>
        ) : null}
        {tail >= 10 && tail ? (
          <a
            onClick={() => onClick(tail)}
            className={tail === pageNumber ? currentPageClass : pageClass}
            aria-current={tail === pageNumber ? 'page' : undefined}
          >
            {tail}
          </a>
        ) : null}
      </div>
      <div className="-mt-px flex w-0 flex-1 cursor-pointer justify-end">
        {pageNumber * pageSize < total && (
          <a
            onClick={() => onClick(pageNumber + 1)}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 size-5 text-gray-400"
              aria-hidden="true"
            />
          </a>
        )}
      </div>
    </nav>
  )
}
