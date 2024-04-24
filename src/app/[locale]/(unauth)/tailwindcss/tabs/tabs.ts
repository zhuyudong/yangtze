import {
  BuildingOfficeIcon,
  CreditCardIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/20/solid'

export const tabs = [
  {
    name: 'My Account',
    href: '#',
    count: '52',
    icon: UserIcon,
    current: false
  },
  {
    name: 'Company',
    href: '#',
    count: '6',
    icon: BuildingOfficeIcon,
    current: false
  },
  {
    name: 'Team Members',
    href: '#',
    count: '4',
    icon: UsersIcon,
    current: true
  },
  {
    name: 'Billing',
    href: '#',
    count: '52',
    icon: CreditCardIcon,
    current: false
  }
]
