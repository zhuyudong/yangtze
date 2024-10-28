import { Menu, Transition } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { Fragment } from 'react'

import { cn } from '@/lib/utils'

import { ArrowLeftStartOnRectangleIcon } from './icons/arrow-left-start-on-rectangle-icon'
// import { UserCircleIcon } from './icons/UserCircleIcon'

export function UserMenu() {
  const { data: session } = useSession()

  return (
    <Menu
      as="div"
      className="relative inline-block min-w-max max-w-max text-left"
    >
      <div>
        {/* <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Options
          <ChevronDownIcon
            className="-mr-1 size-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button> */}
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
          <Image
            className="inline-block size-8 rounded-full"
            width={32}
            height={32}
            src={session?.user?.image ?? '/images/default-blue.png'}
            alt=""
            // onClick={() => signOut()}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          {/* TODO */}
          {/* <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <UserCircleIcon
                    className="mr-3 size-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Profiles
                </a>
              )}
            </Menu.Item>
          </div> */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  // href="#"
                  onClick={() => signOut()}
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <ArrowLeftStartOnRectangleIcon
                    className="mr-3 size-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Log out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
