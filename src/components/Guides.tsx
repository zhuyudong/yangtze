import { useTranslations } from 'next-intl'

import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

export function Guides() {
  const t = useTranslations('Resources')

  const guides: { href: string; name: string; description: string }[] = [
    {
      href: '/react-apis',
      name: t('frontend'),
      description: t('awesome_frontend')
    },
    {
      href: '/python-environment',
      name: 'Python',
      description: t('awesome_python')
    },
    {
      href: '/awesome-backend',
      name: t('backend'),
      description: t('awesome_backend')
    },
    {
      href: '/mongo',
      name: t('database'),
      description: t('awesome_database')
    },
    {
      href: '/aigc',
      name: 'AIG',
      description: t('aigc_is_the_future')
    }
  ]

  return (
    // remove xl:max-w-none
    <div className="my-16">
      <Heading level={2} id="guides">
        {t('technology_column')}
      </Heading>
      {/* NOTE: xl:grid-cols-5 一行 5 列  */}
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-5">
        {guides.map(guide => (
          <div key={guide.href} className="flex flex-col justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                {t('read_more')}
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
