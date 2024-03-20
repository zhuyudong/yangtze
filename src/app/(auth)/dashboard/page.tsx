// import { getTranslations } from 'next-intl/server'

import { CurrentUser } from '@/components/CurrentUser'

// export async function generateMetadata(props: { params: { locale: string } }) {
//   const t = await getTranslations({
//     locale: props.params.locale,
//     namespace: 'Dashboard'
//   })

//   return {
//     title: t('meta_title')
//   }
// }

const Dashboard = () => (
  <div className="[&_p]:my-6">
    <CurrentUser />
  </div>
)

export default Dashboard
