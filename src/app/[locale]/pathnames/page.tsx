 
import { useTranslations } from 'next-intl'

// import { unstable_setRequestLocale } from 'next-intl/server'
import { LocaleLayout } from '@/components/locale-layout'

interface Props {
  params: { locale: string }
}

export default function PathnamesPage({ params: { locale } }: Props) {
  // unstable_setRequestLocale(locale)

  const t = useTranslations('PathnamesPage')

  return (
    <LocaleLayout title={t('title')}>
      <div className="max-w-[490px]">
        {t.rich('description', {
          p: chunks => <p className="mt-4">{chunks}</p>,
          code: chunks => <code className="font-mono text-white">{chunks}</code>
        })}
      </div>
    </LocaleLayout>
  )
}
